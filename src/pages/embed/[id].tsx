/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { trpcClient } from "@/utils/api";
import type { GetServerSideProps } from "next";
import ProgramaticVideo from "@/remotion/Dvideo";
import type { User, Video } from "@prisma/client";
import { Player } from "@remotion/player";

interface Props {
  videoInfo: string | null;
}

export default function Embed({ videoInfo }: Props) {
  const parsedLinkInfo: (Video & { user: User }) | null = videoInfo
    ? JSON.parse(videoInfo)
    : null;
  return (
    <Player
      component={ProgramaticVideo}
      compositionHeight={720}
      compositionWidth={1280}
      durationInFrames={(parsedLinkInfo?.duration || 1) * 30}
      fps={30}
      controls
      style={{ width: "100%", height: "100vh" }}
      inputProps={{
        videoUid: parsedLinkInfo?.videoUid || "",
        screenUid: parsedLinkInfo?.screenUid || "",
        thumbnail: parsedLinkInfo?.thumbnail || "",
      }}
    />
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  if (!id) {
    return { props: { videoInfo: null } };
  }

  try {
    const data = await trpcClient.video.getPublicVideo.query({
      id: id as string,
    });
    return { props: { videoInfo: JSON.stringify(data) } };
  } catch (err) {
    return { props: { videoInfo: null } };
  }
};
