import { AbsoluteFill, Video } from "remotion";
import StandaloneVideos from "./common/StandaloneVideo";

interface Props {
  screenURL: string | null;
  videoURL: string | null;
}

export default function Default({ screenURL, videoURL }: Props) {
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(to right, #5D26C1, #a17fe0, #59C173)",
      }}
      className="flex w-full items-center justify-center"
    >
      {screenURL && videoURL && (
        <>
          <div className="aspect-video h-[90%] w-[94%] overflow-hidden  rounded-xl bg-black">
            <Video className="h-full w-full" startFrom={0} src={screenURL} />
          </div>
          <div className="absolute bottom-5 right-9 h-40 w-40  rounded-full border-4 border-green-50 bg-slate-800">
            <Video
              className="h-full w-full rounded-full object-cover"
              startFrom={0}
              src={videoURL}
            />
          </div>
        </>
      )}

      <StandaloneVideos videoURL={videoURL} screenURL={screenURL} />
    </AbsoluteFill>
  );
}
