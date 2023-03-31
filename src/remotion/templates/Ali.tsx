import { AbsoluteFill, Video } from "remotion";
import StandaloneVideos from "./common/StandaloneVideo";

interface Props {
  screenURL: string | null;
  videoURL: string | null;
}

export default function Default({ screenURL, videoURL }: Props) {
  return (
    <AbsoluteFill className="flex justify-center bg-gray-800 pl-9">
      {screenURL && videoURL && (
        <>
          <div className="h-[92%] w-[90%] rounded-xl bg-black">
            <Video className="h-full w-full" startFrom={0} src={screenURL} />
          </div>
          <div className="absolute top-1/2 right-9  h-[400px] w-[250px] -translate-y-1/2 rounded-xl border-4 border-green-50 ">
            <Video
              className="h-full w-full scale-x-[-1]  rounded-xl object-cover"
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
