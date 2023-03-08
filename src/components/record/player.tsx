import { Frame } from "@/pages/record";

interface Props {
  currentFrame: Frame[];
}

export default function player({ currentFrame }: Props) {
  const videoElements = currentFrame.map((frame) => {
    const videoId = frame === Frame.Screen ? "videoFrame" : "userFrame";
    const isCamNScreen = currentFrame.length > 1;

    return (
      <div
        key={frame}
        className={`
          ml-auto mr-auto
        ${
          isCamNScreen && frame === Frame.Video
            ? "order-2 m-auto aspect-[9/16] h-[85%] "
            : "aspect-video"
        }
      `}
      >
        <video
          id={videoId}
          className={`h-full w-full rounded-md
            ${videoId === "userFrame" ? "scale-x-[-1]" : ""}
            ${
              frame === Frame.Video && currentFrame.length > 1
                ? " object-cover"
                : ""
            }
          `}
          autoPlay
          muted
          playsInline
        />
      </div>
    );
  });

  return <>{videoElements}</>;
}
