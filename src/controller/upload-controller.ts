/* eslint-disable @typescript-eslint/no-unsafe-call */
import { supabase } from "@/lib/supabaseClient";
import { trpcClient } from "@/utils/api";
import { customAlphabet, nanoid } from "nanoid";
import { EventEmitter } from "events";
import Timer from "easytimer.js";
import Router from "next/router";
import generateTitle from "@/utils/generateTitle";

export enum RecordingState {
  Waiting,
  Paused,
  Recording,
  Uploading,
}

interface uploadData {
  signedUrl?: string;
  key?: string;
  uploadId?: string;
}

interface videoPartData {
  PartNumber: number;
  ETag: string;
  IsUploading?: boolean;
}

class UploadController extends EventEmitter {
  private videoRecorder: MediaRecorder | null = null;
  private screenRecorder: MediaRecorder | null = null;
  private videoChunks: Blob[] = [];
  private screenChunks: Blob[] = [];
  private videoStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private linkId: string | undefined = undefined;
  private title: string | undefined = undefined;
  private description: string | undefined = undefined;
  private isStopped = false;
  private timer = new Timer();
  private thumbnail: string | undefined = undefined;
  recordingState: RecordingState = RecordingState.Waiting;

  constructor() {
    super();
    this.handleTimerEvents();
  }

  setStream(stream: MediaStream, type?: string) {
    if (!stream) return;

    if (type === "user") {
      this.videoStream = stream;
    }

    if (type === "screen") {
      this.screenStream = stream;
    }
  }

  setVideoRecorder(recorder: MediaRecorder) {
    recorder.ondataavailable = (event: BlobEvent) => {
      this.videoChunks.push(event.data);
    };
    recorder.onstop = this.saveVideo.bind(this);
  }

  setScreenRecorder(recorder: MediaRecorder) {
    recorder.ondataavailable = (event) => {
      this.screenChunks.push(event.data);
    };
    recorder.onstop = this.saveVideo.bind(this);
  }

  start(
    id: string | null = null,
    title: string | null = null,
    description: string | null = null
  ) {
    if (id && title) {
      this.linkId = id;
      this.title = title;
      if (description) this.description = description;
    }
    this.timer.start();

    if (this.videoStream) {
      this.videoRecorder = new MediaRecorder(this.videoStream);
      this.setVideoRecorder(this.videoRecorder);
      this.videoRecorder.start(5000);
      this.emit("recordingStateChange", RecordingState.Recording);
    }

    if (this.screenStream) {
      this.screenRecorder = new MediaRecorder(this.screenStream);
      this.setScreenRecorder(this.screenRecorder);
      this.screenRecorder.start(5000);
      this.emit("recordingStateChange", RecordingState.Recording);
    }

    this.generateThumbs()
      .then((thumbnail) => {
        this.thumbnail = thumbnail;
      })
      .catch(console.error);
  }

  stop() {
    if (this.videoRecorder && this.videoRecorder.state !== "inactive") {
      this.videoRecorder.stop();
    }
    if (this.screenRecorder && this.screenRecorder.state !== "inactive") {
      this.screenRecorder.stop();
    }
  }

  cancel() {
    this.videoRecorder = null;
    this.screenRecorder = null;
    this.videoChunks = [];
    this.screenChunks = [];

    this.timer.stop();
    this.emit("recordingStateChange", RecordingState.Waiting);
  }

  restart() {
    this.cancel();
    this.emit("action", "showCountDown");
  }

  private async saveVideo() {
    if (this.isStopped) return;

    const timeValues = this.timer.getTimeValues();
    const duration =
      timeValues.hours * 3600 + timeValues.minutes * 60 + timeValues.seconds;

    this.timer.stop();
    this.emit("recordingStateChange", RecordingState.Uploading);
    this.videoStream?.getTracks().forEach((track) => track.stop());
    this.screenStream?.getTracks().forEach((track) => track.stop());

    this.isStopped = true;
    let videoBlob: Blob | null = null;
    let screenBlob: Blob | null = null;

    if (this.videoChunks.length > 0) {
      videoBlob = new Blob(this.videoChunks, { type: "video/webm" });
    }

    if (this.screenChunks.length > 0) {
      screenBlob = new Blob(this.screenChunks, { type: "video/webm" });
    }

    const id = nanoid(10);

    try {
      let videoUid: string | undefined = undefined;
      let screenUid: string | undefined = undefined;

      if (videoBlob) {
        const videoResponse = await supabase.storage
          .from("videos")
          .upload(`feed/video-${id}.webm`, videoBlob, {
            contentType: "video/webm",
            upsert: false,
          });

        videoUid = videoResponse.data?.path;
      }

      if (screenBlob) {
        const screenResponse = await supabase.storage
          .from("videos")
          .upload(`screen/screen-${id}.webm`, screenBlob, {
            contentType: "video/webm",
            upsert: false,
          });
        screenUid = screenResponse.data?.path;
      }

      if (this.thumbnail) {
        const imageBlob = await fetch(this.thumbnail).then((r) => r.blob());
        await supabase.storage.from("thumbs").upload(`${id}.png`, imageBlob, {
          contentType: "image/png",
          upsert: false,
        });
      }

      if (this.linkId) {
        await trpcClient.video.addResponse
          .mutate({
            id,
            title: generateTitle(this.title),
            videoUid: videoUid || "",
            screenUid: screenUid || "",
            duration,
            linkId: this.linkId,
            description: this.description,
            thumbnail: `${id}.png`,
          })
          .catch(console.error);
      } else {
        await trpcClient.video.add
          .mutate({
            id,
            title: generateTitle(this.title),
            videoUid: videoUid || "",
            screenUid: screenUid || "",
            duration,
            linkId: this.linkId,
            description: this.description,
            thumbnail: `${id}.png`,
          })
          .catch(console.error);
      }
    } catch (err) {
      console.log(err);
    }

    this.emit("recordingStateChange", RecordingState.Waiting);
    this.screenStream?.getTracks().forEach((track) => track.stop());
    this.videoStream?.getTracks().forEach((track) => track.stop());

    this.videoChunks = [];
    this.screenChunks = [];
    this.videoRecorder = null;
    this.screenRecorder = null;
    this.videoStream = null;
    this.screenStream = null;

    Router.push(`/video/${id}`).catch(console.error);
  }

  private generateThumbs(): Promise<string> {
    return new Promise((resolve, reject) => {
      const videoFrame = document.getElementById(
        "videoFrame"
      ) as HTMLVideoElement;
      const userFrame = document.getElementById(
        "userFrame"
      ) as HTMLVideoElement;
      if (videoFrame) {
        const canvas = document.createElement("canvas");
        canvas.width = 420;
        canvas.height = 230;

        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(videoFrame, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/png");
          resolve(dataUrl);
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = 420;
      canvas.height = 230;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(userFrame, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      }
    });
  }

  private handleTimerEvents() {
    this.timer.addEventListener("secondsUpdated", (e) => {
      this.emit("secondsUpdated", this.timer.getTimeValues().toString());
      document.title = this.timer
        .getTimeValues()
        .toString(["minutes", "seconds"]);
    });

    this.timer.addEventListener("started", (e) => {
      this.emit("started");
    });

    this.timer.addEventListener("reset", (e) => {
      this.emit("reset");
    });

    this.timer.addEventListener("stopped", (e) => {
      this.emit("stopped");
    });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UploadController();
