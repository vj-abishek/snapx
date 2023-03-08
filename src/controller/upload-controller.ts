/* eslint-disable @typescript-eslint/no-unsafe-call */
import { trpcClient } from "@/utils/api";
import { nanoid } from "nanoid";

export enum RecordingState {
  Waiting,
  Paused,
  Recording,
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

class UploadController {
  private videoRecorder: MediaRecorder | null = null;
  private screenRecorder: MediaRecorder | null = null;
  private videoChunks: Blob[] = [];
  private screenChunks: Blob[] = [];
  private videoStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private videoUploadData: uploadData | null = null;
  private videoPartData: videoPartData[] = [];
  private videoPartNumber = 0;
  private bufferSize = 1024 * 1024 * 5; // 5MB
  private buffer = Buffer.alloc(this.bufferSize);
  private offset = 0;
  recordingState: RecordingState = RecordingState.Waiting;

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
    recorder.ondataavailable = async (event: BlobEvent) => {
      const chunk = event.data;
      const remainingSpace = this.bufferSize - this.offset;
      const bytesToWrite = Math.min(chunk.size, remainingSpace);

      console.log(
        remainingSpace,
        bytesToWrite,
        chunk.size,
        this.bufferSize,
        this.offset
      );

      if (bytesToWrite > 0) {
        // Copy the chunk to the buffer
        const arrayBuffer = await new Response(chunk).arrayBuffer();
        const source = new Uint8Array(arrayBuffer);

        if (this.offset + bytesToWrite > this.bufferSize) {
          // Wrap around to the beginning of the buffer
          const firstChunkSize = this.bufferSize - this.offset;
          this.buffer.set(source.slice(0, firstChunkSize), this.offset);
          this.buffer.set(source.slice(firstChunkSize, bytesToWrite), 0);
        } else {
          this.buffer.set(source.slice(0, bytesToWrite), this.offset);
        }

        // Update the offset
        this.offset = (this.offset + bytesToWrite) % this.bufferSize;

        // Check if the buffer is full
        if (this.offset === 0) {
          const blob = new Blob([this.buffer], { type: "video/webm" });
          this.uploadBuffer(blob).catch(console.error);
          console.log("Buffer full");
        }
      }
    };
    recorder.onstop = this.saveVideo.bind(this);
  }

  setScreenRecorder(recorder: MediaRecorder) {
    recorder.ondataavailable = (event) => {
      this.screenChunks.push(event.data);
      this.uploadChunks(this.screenChunks).catch((err) => console.log(err));
    };
    recorder.onstop = this.saveVideo.bind(this, this.screenChunks);
  }

  async start() {
    if (this.videoStream) {
      this.videoRecorder = new MediaRecorder(this.videoStream);
      this.setVideoRecorder(this.videoRecorder);
      const id = this.generateUrlFriendlyString(nanoid, 15);
      this.videoUploadData = await trpcClient.s3.init.mutate({
        format: `${id}.webm`,
        contentType: "video/webm",
      });
      this.videoRecorder.start(5000);
      this.recordingState = RecordingState.Recording;
    }

    if (this.screenStream) {
      this.screenRecorder = new MediaRecorder(this.screenStream);
      this.setScreenRecorder(this.screenRecorder);
      const id = this.generateUrlFriendlyString(nanoid, 15);
      this.videoUploadData = await trpcClient.s3.init.mutate({
        format: `${id}.webm`,
        contentType: "video/webm",
      });
      this.screenRecorder.start(5000);
      this.recordingState = RecordingState.Recording;
    }
  }

  stop() {
    if (this.videoRecorder && this.videoRecorder.state !== "inactive") {
      this.videoRecorder.stop();
    }
    if (this.screenRecorder && this.screenRecorder.state !== "inactive") {
      this.screenRecorder.stop();
    }
  }

  private uploadChunks(chunks: Blob[]) {
    this.videoPartNumber++;

    if (this.videoPartNumber === 1) {
      try {
        console.log(this.videoUploadData);

        if (chunks.length > 0) {
          return;
        }
      } catch (err) {
        console.log(err);
      }
    }

    console.log("calling upload");
  }

  private async uploadBuffer(blob: Blob) {
    try {
      this.videoPartNumber += 1;

      if (this.videoPartNumber === 1) {
        console.log("init fn");
        this.videoPartData.push({
          PartNumber: this.videoPartNumber,
          ETag: "",
          IsUploading: true,
        });

        const response = await this.upload(
          this.videoUploadData?.signedUrl,
          blob
        ).catch(console.error);

        if (response?.status === 200) {
          this.videoPartData = this.videoPartData.map((part) => {
            if (part.PartNumber === this.videoPartNumber) {
              part.IsUploading = false;
              part.ETag = response.headers.get("ETag") || "";
            }

            return part;
          });
        }

        return;
      }

      this.videoPartData.push({
        PartNumber: this.videoPartNumber,
        ETag: "",
        IsUploading: true,
      });

      const uploadPart = await trpcClient.s3.uploadPart.mutate({
        key: this.videoUploadData?.key || "",
        uploadId: this.videoUploadData?.uploadId || "",
        partNumber: this.videoPartNumber,
      });

      const response = await this.upload(uploadPart.signedUrl, blob).catch(
        console.error
      );

      if (response?.status === 200) {
        this.videoPartData = this.videoPartData.map((part) => {
          if (part.PartNumber === this.videoPartNumber) {
            part.IsUploading = false;
            part.ETag = response.headers.get("ETag") || "";
          }

          return part;
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async upload(signedUrl: string | undefined, blob: Blob) {
    if (!signedUrl) return;

    const response = await fetch(signedUrl, {
      method: "PUT",
      body: blob,
    });

    return response;
  }

  private checkIfAllPartsAreUploaded() {
    const interval = setInterval(() => {
      console.log("checking", this.videoPartData);
      if (this.videoPartData.some((part) => !part?.IsUploading)) {
        this.saveVideo().catch(console.error);
        clearInterval(interval);
      }
    }, 3000);
  }

  private async saveVideo() {
    // console.log(this.buffer, this.buffer.byteLength, this.buffer.byteOffset);
    console.log("condition");

    if (this.videoPartData.some((part) => part.IsUploading)) {
      this.checkIfAllPartsAreUploaded();
      return;
    }

    console.log(this.buffer);

    if (this.buffer[0] === 0) {
      const blob = new Blob([this.buffer], { type: "video/webm" });
      console.log(blob);
      await this.uploadBuffer(blob).catch(console.error);
      console.log("Buffer full");
    }

    await trpcClient.s3.complete.mutate({
      key: this.videoUploadData?.key || "",
      uploadId: this.videoUploadData?.uploadId || "",
      parts: this.videoPartData,
    });

    this.recordingState = RecordingState.Waiting;
    this.videoChunks = [];
    this.screenChunks = [];
    this.videoRecorder = null;
    this.screenRecorder = null;
    this.videoStream = null;
    this.screenStream = null;
    this.videoPartNumber = 0;
  }

  private generateUrlFriendlyString(
    nanoidFn: (size: number) => string,
    length: number
  ): string {
    const randomString = nanoidFn(length);
    const text = randomString.replace(/[^a-z0-9\s-]/gi, "");
    const hyphenatedText = text.replace(/\s+/g, "-");
    const lowercaseText = hyphenatedText.toLowerCase();
    const finalText = lowercaseText.replace(/--/g, "-");
    return finalText;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UploadController();
