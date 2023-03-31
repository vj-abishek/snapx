import { LinkIcon, ShareIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Avatar from "@/components/primitives/avatar";
import { Player } from "@remotion/player";
import ProgramaticVideo from "@/remotion/Dvideo";
import { api } from "@/utils/api";
import * as timeago from "timeago.js";
import MyDialog from "@/components/primitives/dialog";
import { useEffect, useState } from "react";

export default function ShowVideo() {
  const router = useRouter();
  const id = router.query.id?.toString() ?? undefined;
  const videoInfo = api.video.get.useQuery({ id }, { staleTime: Infinity });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const videoAccess = api.video.access.useMutation();

  const toggleShareModal = () => {
    setShareModalOpen(!shareModalOpen);
  };

  useEffect(() => {
    if (shareModalOpen) {
      videoAccess.mutate({ videoId: id || "" });
    }
  }, [shareModalOpen]);

  return (
    !videoInfo.isLoading && (
      <>
        <Head>
          <title>{videoInfo.data?.title}</title>
        </Head>
        <div className="container mx-auto min-h-screen w-full  max-w-[70rem] p-3  sm:p-4">
          <div className="w-full max-w-5xl">
            {videoInfo.isLoading || !videoInfo?.data?.duration ? (
              <div className="aspect-video h-full w-full animate-pulse rounded-xl bg-primary-200"></div>
            ) : (
              <Player
                component={ProgramaticVideo}
                compositionHeight={720}
                compositionWidth={1280}
                durationInFrames={videoInfo?.data?.duration * 30}
                fps={30}
                controls
                style={{ width: "100%" }}
                className="rounded-xl"
                inputProps={{
                  videoUid: videoInfo.data?.videoUid || "",
                  screenUid: videoInfo.data?.screenUid || "",
                  thumbnail: videoInfo.data?.thumbnail || "",
                }}
              />
            )}
            <div className="mt-3 flex w-full flex-row justify-between">
              <div className="flex flex-row">
                <Avatar
                  src={videoInfo.data?.user?.image}
                  alt={videoInfo.data?.user?.name}
                />
                <div className="ml-3 flex flex-col justify-center">
                  <h4 className="font-heading capitalize">
                    {videoInfo.data?.title}
                  </h4>
                  <p className="text-sm text-primary-300">
                    {videoInfo.data?.user.name} ·{" "}
                    {videoInfo.data?.createdAt &&
                      timeago.format(videoInfo.data?.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleShareModal}
                className="btn btn-primary flex flex-row items-center justify-center gap-3"
              >
                <LinkIcon className="h-5 w-5" />
                <span>Share video</span>
              </button>
            </div>
            <div>
              <p className="mt-5 ml-14 max-w-3xl pb-14">
                {videoInfo.data?.description}
              </p>
            </div>
          </div>
        </div>

        <MyDialog
          title="Share"
          open={shareModalOpen}
          onClose={toggleShareModal}
        >
          <div className="mt-3">
            <div className="w-full">
              <input
                id="emailId"
                placeholder="acme@company.com"
                type="email"
                className="input w-full"
              />
            </div>
            <div className="mt-4">
              <p className="font-medium">People with access</p>
              <div className="mt-3">
                <div className="flex flex-row items-center gap-3">
                  <Avatar
                    src={videoAccess.data?.user.image}
                    alt={videoAccess.data?.user.name}
                  />
                  <div className="flex flex-col">
                    <p className="font-medium text-primary-100">
                      {videoAccess.data?.user.name}
                    </p>
                    <p className="text-sm text-primary-300">
                      {videoAccess.data?.user.email}
                    </p>
                  </div>
                  <div className="ml-auto text-sm capitalize text-primary-300">
                    {videoAccess.data?.role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MyDialog>
      </>
    )
  );
}
