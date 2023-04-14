/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ArrowPathIcon,
  PauseCircleIcon,
  TrashIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from "@heroicons/react/24/outline";
import { Frame } from "@/pages/record";
import { useEffect, useState } from "react";
import { RecordingState } from "src/controller/upload-controller";
import { Router } from "next/router";

interface Props {
  frame: Frame[];
  changeFrame: (frame: Frame, type?: string) => void;
  setStream: (stream: MediaStream | null, type: string) => void;
  getStream: (type: string) => boolean;
  toggleRecording?: () => void;
  recordingState?: RecordingState;
  cancelFn?: () => void;
  restartFn?: () => void;
}

export default function Controls({
  frame,
  changeFrame,
  setStream,
  getStream,
  toggleRecording,
  recordingState,
  cancelFn,
  restartFn,
}: Props) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const getVideoStream = async () => {
    console.log("again got camera");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return stream;
  };

  const getScreenStream = async () => {
    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: {
          ideal: 1920,
        },
        height: {
          ideal: 1080,
        },
      },
      audio: true,
    });
  };

  useEffect(() => {
    if (
      recordingState === RecordingState.Waiting &&
      frame.includes(Frame.Video) &&
      !getStream("user")
    ) {
      getVideoStream()
        .then((stream) => {
          window.setTimeout(() => {
            const videoFrame = document.getElementById(
              "userFrame"
            ) as HTMLVideoElement;
            if (!videoFrame) return;

            setVideoStream(stream);

            if ("srcObject" in videoFrame) {
              videoFrame.srcObject = stream;
              setStream(stream, "user");
            }
          });
        })
        .catch((err) => {
          console.log(err);
          setStream(null, "user");
          changeFrame(Frame.Video);
        });
    }

    if (
      recordingState === RecordingState.Waiting &&
      frame.includes(Frame.Screen) &&
      !getStream("screen")
    ) {
      getScreenStream()
        .then((stream) => {
          window.setTimeout(() => {
            const videoFrame = document.getElementById(
              "videoFrame"
            ) as HTMLVideoElement;
            if (!videoFrame) return;

            setScreenStream(stream);

            if ("srcObject" in videoFrame) {
              videoFrame.srcObject = stream;
              setStream(stream, "screen");
            }
          });
        })
        .catch((err) => {
          console.log(err);
          changeFrame(Frame.Screen);
          setStream(null, "screen");
        });
    }
  }, [frame]);

  const stopStream = () => {
    videoStream?.getTracks().forEach((track) => {
      track.stop();
    });
    screenStream?.getTracks().forEach((track) => {
      track.stop();
    });
  };

  useEffect(() => {
    Router.events.on("routeChangeStart", stopStream);

    return () => {
      Router.events.off("routeChangeStart", stopStream);
    };
  }, [videoStream, screenStream]);

  return (
    <div className="absolute bottom-6 mt-10 flex w-full items-center justify-center bg-transparent text-xs ">
      <div className="flex flex-row items-center gap-2 rounded-full bg-primary-200 px-7 py-2 shadow-xl backdrop-blur-lg sm:px-7 sm:py-3">
        {recordingState === RecordingState.Recording ? (
          <button className="flex cursor-pointer flex-col items-center justify-center gap-1  rounded-lg  px-4 py-2 hover:bg-primary-700/[0.12]">
            <div
              onClick={cancelFn}
              className="flex flex-col items-center justify-center "
            >
              <TrashIcon className="h-5 w-4" />
              <span>Cancel</span>
            </div>
          </button>
        ) : (
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-1  rounded-lg  px-4 py-2 hover:bg-primary-700/[0.12]"
            onClick={() => changeFrame(Frame.Video)}
          >
            {frame.includes(Frame.Video) ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <VideoCameraSlashIcon className="h-5 w-5 " />
                <span>Stop camera</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1">
                <VideoCameraIcon className="h-5 w-5 " />
                <span>Share camera</span>
              </div>
            )}
          </div>
        )}

        {recordingState === RecordingState.Recording ? (
          <button
            onClick={toggleRecording}
            aria-label="Stop recording"
            className="group cursor-pointer px-4 disabled:cursor-not-allowed"
          >
            <div className="shadow-recording-btn group-enabled:hover:shadow-recording-heavy-btn flex h-12 w-12 items-center justify-center rounded-full border border-4 border-red-700/50 transition duration-300 group-enabled:hover:border-red-700">
              <div className="h-4 w-4 rounded  !bg-red-700 transition duration-500 group-enabled:hover:!bg-red-700 group-disabled:!bg-red-700/50"></div>
            </div>
          </button>
        ) : (
          <button
            onClick={toggleRecording}
            aria-label="Start recording"
            className="group cursor-pointer px-4 disabled:cursor-not-allowed"
            disabled={frame.length === 0}
          >
            <div className="shadow-recording-btn group-enabled:hover:shadow-recording-heavy-btn flex h-12 w-12 items-center justify-center rounded-full border-4 border-red-700/50 transition duration-300 group-enabled:hover:border-red-700">
              <div className="h-8 w-8 rounded-full bg-red-700 transition duration-500 group-enabled:hover:!bg-red-700 group-disabled:!bg-red-700/50"></div>
            </div>
          </button>
        )}

        {recordingState === RecordingState.Recording ? (
          <>
            <div className="flex cursor-pointer flex-row items-center justify-center rounded-lg  px-4 py-2 hover:bg-primary-700/[0.12]">
              <div
                onClick={restartFn}
                className="flex flex-col items-center justify-center "
              >
                <ArrowPathIcon className="h-5 w-4" />
                <span>Restart</span>
              </div>
            </div>
          </>
        ) : (
          <button
            className="group flex cursor-not-allowed flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 hover:bg-primary-700/[0.12] lg:cursor-pointer"
            onClick={() => changeFrame(Frame.Screen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current text-primary-700"
            >
              <path d="M9 6H5v4h2V8h2m10 2h-2v2h-2v2h4m2 2H3V4h18m0-2H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h7v2H8v2h8v-2h-2v-2h7a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2" />
            </svg>

            {frame.includes(Frame.Screen) ? (
              <span>Stop screen</span>
            ) : (
              <span>Share screen</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
