import { trpcClient } from "@/utils/api";
import type { InstantLink, User, Video } from "@prisma/client";
import VideoCard from "@/components/recordings/VideoCard";

interface Props {
  videos: InstantLink & {
    user: User;
    video: Video[];
  };
  isLinkdedVideos?: boolean;
}

export default function CreatedVideos({ videos }: Props) {
  console.log(videos);
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* {videos.video.length &&
        videos.map((video) => (
          <VideoCard
            video={{ ...video, user: { ...videos.user } }}
            key={video.id}
          />
        ))} */}
    </div>
  );
}
