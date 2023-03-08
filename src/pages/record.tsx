import Head from "next/head";
import Controls from "@/components/ui/controls";
import { useCallback, useEffect, useRef, useState } from "react";
import Player from "@/components/record/player";
import uploadController, {
  RecordingState,
} from "src/controller/upload-controller";
import { api } from "@/utils/api";
import { nanoid } from "nanoid";

export enum Frame {
  NoFrame,
  Video,
  Screen,
  CameraAndScreen,
}

export default function Record() {
  const [currentFrame, setCurrentFrame] = useState([Frame.Video]);
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  const changeFrame = useCallback(
    (newFrame: Frame) => {
      if (currentFrame.includes(newFrame)) {
        const whatFrame = currentFrame.filter((frame) => frame !== newFrame);
        setCurrentFrame(whatFrame);

        if (newFrame === Frame.Video) {
          userStream?.getTracks().forEach((track) => {
            track.stop();
          });
          setUserStream(null);
        }

        if (newFrame === Frame.Screen) {
          videoStream?.getTracks().forEach((track) => {
            track.stop();
          });
          setVideoStream(null);
        }
        return;
      }

      setCurrentFrame([...currentFrame, newFrame]);
    },
    [currentFrame, userStream, videoStream]
  );

  useEffect(() => {
    userStream?.getTracks().forEach((track) => {
      track.onended = () => {
        changeFrame(Frame.Video);
      };
    });
  }, [changeFrame, userStream]);

  useEffect(() => {
    videoStream?.getTracks().forEach((track) => {
      track.onended = () => {
        changeFrame(Frame.Screen);
      };
    });
  }, [changeFrame, videoStream]);

  const setStream = (stream: MediaStream | null, type: string) => {
    if (type === "user") {
      setUserStream(stream);
    } else {
      setVideoStream(stream);
    }
  };

  const getStream = (type: string) => {
    if (type === "user") {
      return userStream !== null;
    } else {
      return videoStream !== null;
    }
  };

  const toggleRecording = () => {
    if (uploadController.recordingState === RecordingState.Waiting) {
      if (videoStream) {
        uploadController.setStream(videoStream, "screen");
      }
      if (userStream) {
        uploadController.setStream(userStream, "user");
      }

      uploadController.start();
      return;
    }

    if (uploadController.recordingState === RecordingState.Recording) {
      uploadController.stop();
      return;
    }
  };

  return (
    <>
      <Head>
        <title>SnapX - 🚀 Record your video</title>
      </Head>
      <div className="min-h-screen w-full bg-primary-700 text-primary-900 ">
        <div className="flex h-[80vh] flex-col items-center justify-center bg-primary-100 text-center">
          {currentFrame.length ? (
            <div className="flex h-full w-full flex-row ">
              <Player currentFrame={currentFrame} />
            </div>
          ) : (
            <>
              <h4 className="text-primary-900">No preview avaliable</h4>
              <p className="mt-3 w-72">
                You also need to share your screen, or camera to start
                recording.
              </p>
            </>
          )}
        </div>

        {/* Controls */}
        <Controls
          frame={currentFrame}
          changeFrame={changeFrame}
          setStream={setStream}
          getStream={getStream}
          toggleRecording={toggleRecording}
        />
      </div>
    </>
  );
}
