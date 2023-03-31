import { Video } from "remotion";

interface Props {
  screenURL: string | null;
  videoURL: string | null;
}

export default function StandaloneVideo({ screenURL, videoURL }: Props) {
  return (
    <>
      {screenURL && !videoURL && (
        <div className="aspect-video h-[90%] w-[90%] overflow-hidden rounded-xl bg-black">
          <Video className="h-full w-full" startFrom={0} src={screenURL} />
        </div>
      )}

      {!screenURL && videoURL && (
        <div className="h-[90%] w-[97%] rounded-xl bg-black">
          <Video className="h-full w-full" startFrom={0} src={videoURL} />
        </div>
      )}
    </>
  );
}
