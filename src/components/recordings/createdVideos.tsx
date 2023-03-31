import { trpcClient } from "@/utils/api";
import type { User, Video } from "@prisma/client";
import VideoCard from "./VideoCard";

interface Props {
  videos: (Video & { user: User })[];
}

export default function CreatedVideos({ videos }: Props) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {videos.length ? (
        videos.map((video) => <VideoCard video={video} key={video.id} />)
      ) : (
        <p className="text-primary-300">No videos found</p>
      )}
    </div>
  );
}
