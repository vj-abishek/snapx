/* eslint-disable @next/next/no-img-element */
import type { User, Video } from "@prisma/client";
import Image from "next/image";
import PlaceHolder from "@/assets/placeholder.png";
import Avatar from "@/components/primitives/avatar";
import * as timeago from "timeago.js";
import Link from "next/link";

interface Props {
  video: Video & { user: User };
}
function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesStr = `${minutes < 10 ? "0" : ""}${minutes}`;
  const secondsStr = `${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;

  return `${minutesStr}:${secondsStr}`;
}

export default function VideoCard({ video }: Props) {
  return (
    <Link href={`/video/${video.id}`}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        {video.thumbnail ? (
          <img
            className="h-full w-full object-cover"
            alt={video.title}
            loading="lazy"
            src={`/api/image?id=${video.thumbnail as string}`}
          />
        ) : (
          <Image
            className="backdrop-sepia-0 "
            alt={video.title}
            src={PlaceHolder}
            objectFit="cover"
          />
        )}
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          className="absolute right-1 bottom-2 rounded-sm  text-primary-900"
        >
          <span className=" px-2 py-1 text-xs font-semibold">
            {formatTime(video.duration ?? 0)}
          </span>
        </div>
      </div>
      <div className="flex flex-row px-2 py-3">
        <div style={{ flexBasis: 50 }}>
          <Avatar
            src={video.user.image || "/images/user.png"}
            alt={video.user.name}
          />
        </div>
        <div className="ml-3 flex flex-col justify-center">
          <div className="text-base font-medium capitalize text-gray-900 line-clamp-2 dark:text-primary-900">
            {video.title}
          </div>
          <div className="mt-1 text-sm text-primary-400">
            {video.user.name} ·{" "}
            {video.createdAt && timeago.format(video.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
}
