/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import type { InstantLink } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import * as timeago from "timeago.js";

interface Props {
  data:
    | (InstantLink & {
        _count: {
          video: number;
        };
      })[]
    | undefined;
}

function pluralizeString(str: string, length: number) {
  if (length > 1) return `${str}s`;
  return str;
}

export default function Links({ data }: Props) {
  const router = useRouter();
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data &&
        data.map((link) => (
          <Link
            href={{
              query: {
                ...router.query,
                link: link.linkId,
              },
            }}
            key={link.id}
            className="flex flex-row items-center justify-between rounded-md border-2 border-primary-700 bg-primary-900 p-3 transition-all hover:border-primary-400"
          >
            <div className="flex flex-col">
              <div className="line-clamp-1">{link.title}</div>
              <span className="text-sm text-primary-300">
                {link._count.video
                  ? `${link?._count?.video} ${pluralizeString(
                      "response",
                      link?._count?.video
                    )} · `
                  : ""}
                {link.createdAt && timeago.format(link.updatedAt)}
              </span>
            </div>
            <div>
              <ArrowRightIcon className="h-5 w-5 text-primary-400" />
            </div>
          </Link>
        ))}
    </div>
  );
}
