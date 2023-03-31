/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useSession } from "next-auth/react";
import Link from "next/link";
import Avatar from "@/components/primitives/avatar";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { trpcClient } from "@/utils/api";
import type { User, Video } from "@prisma/client";
import Head from "next/head";
import { Player } from "@remotion/player";
import ProgramaticVideo from "@/remotion/Dvideo";
import * as timeago from "timeago.js";
import { LinkIcon } from "@heroicons/react/20/solid";

interface Props {
  videoInfo: string | null;
}

export default function Share({ videoInfo }: Props) {
  const parsedLinkInfo: (Video & { user: User }) | null = videoInfo
    ? JSON.parse(videoInfo)
    : null;

  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>{`${parsedLinkInfo?.title || ""} / Snapx`}</title>
      </Head>
      <main>
        <nav className="flex justify-between py-3 px-5">
          <Link href="/home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="103"
              height="33"
              fill="none"
            >
              <path
                fill="#000"
                d="M6.72 17.44c0 1.472 1.056 2.208 3.168 2.208 2.133 0 3.2-.661 3.2-1.984 0-.704-.363-1.28-1.088-1.728-.725-.448-1.61-.821-2.656-1.12a47.922 47.922 0 0 1-3.104-1.024 6.709 6.709 0 0 1-2.624-1.856c-.725-.853-1.088-1.91-1.088-3.168 0-5.355 3.445-8.032 10.336-8.032 2.517 0 4.416.48 5.696 1.44 1.301.939 1.952 2.25 1.952 3.936 0 .619-.085 1.216-.256 1.792-.15.555-.31.95-.48 1.184l-.256.384h-5.664c.47-.49.704-1.11.704-1.856 0-1.387-.907-2.08-2.72-2.08-2.283 0-3.424.725-3.424 2.176 0 .725.363 1.301 1.088 1.728.725.427 1.6.768 2.624 1.024 1.045.235 2.09.533 3.136.896a6.02 6.02 0 0 1 2.656 1.824c.725.832 1.088 1.92 1.088 3.264 0 2.71-.81 4.725-2.432 6.048-1.621 1.301-4.117 1.952-7.488 1.952-3.37 0-5.675-.597-6.912-1.792C1.259 21.76.8 20.523.8 18.944c0-.597.064-1.248.192-1.952l.096-.512h5.76l-.064.384a2.965 2.965 0 0 0-.064.576Zm25.038-3.264c0-.917-.448-1.376-1.344-1.376-.875 0-1.6.33-2.176.992L26.446 24h-5.44l2.72-15.392h5.056l-.352 1.888c1.259-1.557 2.848-2.336 4.768-2.336s3.168.47 3.744 1.408c.363.597.544 1.28.544 2.048s-.053 1.483-.16 2.144l-.864 4.928a2.158 2.158 0 0 0-.032.352c0 .576.32.864.96.864.49 0 .928-.107 1.312-.32l-.16 3.616c-1.003.832-2.144 1.248-3.424 1.248-2.901 0-4.352-1.216-4.352-3.648 0-.427.043-.885.128-1.376l.768-4.256c.064-.384.096-.715.096-.992Zm23.829 4.896c0 .555.277.832.832.832.576 0 1.056-.107 1.44-.32l-.16 3.616c-1.024.832-2.176 1.248-3.456 1.248-2.347 0-3.648-.853-3.904-2.56-1.067 1.707-2.635 2.56-4.704 2.56-3.499 0-5.248-1.504-5.248-4.512 0-.512.053-1.077.16-1.696l.672-3.744c.341-1.92 1.12-3.445 2.336-4.576 1.237-1.152 2.837-1.728 4.8-1.728 1.984 0 3.328.459 4.032 1.376l.16-.96h4.864l-1.792 10.08a2.336 2.336 0 0 0-.032.384Zm-9.472-1.536a3.88 3.88 0 0 0-.064.8c0 .341.16.683.48 1.024.32.32.853.48 1.6.48.768 0 1.43-.299 1.984-.896l.96-5.376c-.235-.533-.79-.8-1.664-.8-1.643 0-2.603.79-2.88 2.368l-.416 2.4Zm24.818-9.344c2.176 0 3.68.576 4.512 1.728.597.79.896 1.792.896 3.008 0 .49-.053 1.013-.16 1.568l-.64 3.744c-.363 2.027-1.141 3.573-2.336 4.64-1.195 1.045-2.688 1.568-4.48 1.568-1.792 0-3.04-.48-3.744-1.44l-1.728 9.888h-5.44l4.288-24.288h4.928l-.16.864c1.003-.853 2.357-1.28 4.064-1.28ZM67.605 19.84c.597 0 1.152-.192 1.664-.576.512-.384.832-.96.96-1.728l.416-2.4c.043-.213.064-.48.064-.8 0-.32-.139-.661-.416-1.024-.277-.363-.757-.544-1.44-.544-1.11 0-1.835.267-2.176.8l-.96 5.376c.299.597.928.896 1.888.896ZM94.266 24h-5.952l-2.271-4.448L82.203 24H76.25l6.912-7.872-4.16-7.744h6.049l2.175 4.384 3.745-4.384h6.047l-6.944 7.776L94.267 24Zm2.144-1.856c0-1.365.299-2.357.896-2.976.597-.64 1.547-.96 2.848-.96 1.792 0 2.688.79 2.688 2.368 0 1.344-.309 2.325-.928 2.944-.597.619-1.547.928-2.848.928-1.77 0-2.656-.768-2.656-2.304Z"
              />
            </svg>
          </Link>

          {sessionData ? (
            <Avatar
              src={sessionData.user.image || "/images/user.png"}
              alt={sessionData.user.name}
            />
          ) : (
            <Link className="btn btn-secondary" href="/register">
              Record a video
            </Link>
          )}
        </nav>
        <div className="containter mx-auto max-w-6xl pb-8">
          <Player
            component={ProgramaticVideo}
            compositionHeight={720}
            compositionWidth={1280}
            durationInFrames={(parsedLinkInfo?.duration || 1) * 30}
            fps={30}
            controls
            style={{ width: "100%" }}
            className="rounded-xl"
            inputProps={{
              videoUid: parsedLinkInfo?.videoUid || "",
              screenUid: parsedLinkInfo?.screenUid || "",
              thumbnail: parsedLinkInfo?.thumbnail || "",
            }}
          />
          <div className="mt-3 flex w-full flex-row justify-between px-2">
            <div className="flex flex-row">
              <Avatar
                src={parsedLinkInfo?.user?.image}
                alt={parsedLinkInfo?.user?.name}
              />
              <div className="ml-3 flex flex-col justify-center">
                <h4 className="font-heading capitalize">
                  {parsedLinkInfo?.title}
                </h4>
                <p className="text-sm text-primary-300">
                  {parsedLinkInfo?.user.name} ·{" "}
                  {parsedLinkInfo?.createdAt &&
                    timeago.format(parsedLinkInfo?.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="mt-5 ml-14 max-w-3xl pb-14">
              {parsedLinkInfo?.description}
            </p>
          </div>
        </div>
      </main>
    </>
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
