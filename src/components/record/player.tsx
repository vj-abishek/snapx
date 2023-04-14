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
          ml-auto mr-auto h-screen w-screen lg:h-auto lg:w-auto flex items-center
        ${
          isCamNScreen && frame === Frame.Video
            ? "order-2 m-auto aspect-[9/16] !h-[85%] "
            : "aspect-video"
        }
      `}
      >
        <video
          id={videoId}
          className={`h-full w-full rounded-md object-cover lg:object-contain
            ${videoId === "userFrame" ? "scale-x-[-1]" : ""}
            ${
              frame === Frame.Video && currentFrame.length > 1
                ? "!object-cover"
                : ""
            }
            ${
              frame === Frame.Screen && currentFrame.length > 1
                ? "!object-contain lg:!object-cover !h-[85%]"
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
