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
      className="flex justify-center  pl-9"
    >
      {screenURL && videoURL && (
        <div className="flex flex-row">
          <div className="h-[97%] w-[250px] rounded-sm ">
            <Video
              className="h-full w-full scale-x-[-1] rounded-sm object-cover"
              startFrom={0}
              src={videoURL}
            />
          </div>
          <div className="h-[97%] w-[80%] rounded-sm ">
            <Video className="h-full w-full" startFrom={0} src={screenURL} />
          </div>
        </div>
      )}

      <StandaloneVideos videoURL={videoURL} screenURL={screenURL} />
    </AbsoluteFill>
  );
}
