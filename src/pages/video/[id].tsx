import {
  LinkIcon,
  ShareIcon,
  CodeBracketIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
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
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

export default function ShowVideo() {
  const router = useRouter();
  const id = router.query.id?.toString() ?? undefined;
  const videoInfo = api.video.get.useQuery({ id }, { staleTime: Infinity });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  // const videoAccess = api.video.access.useMutation();
  const [copyLinkText, setCopyLinkText] = useState("Copy Link");

  const toggleShareModal = () => {
    setShareModalOpen(!shareModalOpen);
  };

  const getVideoURL = (embed = false) => {
    const url = window.location.origin;
    const videoId = videoInfo.data?.id || "";

    if (videoId) {
      if (embed) {
        return `${url}/embed/${videoId}`;
      }
      return `${url}/share/${videoId}`;
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(getVideoURL() || "");
    setCopyLinkText("Copied!");
    setTimeout(() => {
      setCopyLinkText("Copy Link");
    }, 2000);
  };

  const handleTwitterClick = () => {
    const url = getVideoURL(true) || "";
    const text = videoInfo.data?.title || "";
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=snapx`,
      "_blank"
    );
  };

  const handleLinkedInClick = () => {
    const url = getVideoURL(true) || "";
    const text = videoInfo.data?.title || "";
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${text}`,
      "_blank"
    );
  };

  const copyEmbedCode = async () => {
    const url = getVideoURL(true) || "";
    const code = `<iframe width="560" height="315"  src="${url}" title="${
      videoInfo.data?.title || "Snapx video"
    }"  allow="accelerometer; autoplay; clipboard-write;"  frameborder="0" allowfullscreen></iframe>`;
    await navigator.clipboard.writeText(code);
  };

  return (
    !videoInfo.isLoading && (
      <>
        <Head>
          <title>{videoInfo.data?.title}</title>
        </Head>
        <div className="container mx-auto min-h-screen w-full  max-w-[70rem] p-2 sm:p-4  lg:p-3">
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
            <div className="mt-3 flex w-full flex-col justify-between lg:flex-row">
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
                className="btn btn-primary mt-3 flex flex-row items-center justify-center gap-3 lg:mt-0"
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

        {shareModalOpen && (
          <MyDialog
            title="Share"
            open={shareModalOpen}
            onClose={toggleShareModal}
          >
            <div className="mt-5">
              <div className="flex w-full flex-col gap-1 lg:flex-row">
                <input
                  id="emailId"
                  disabled
                  title={getVideoURL()}
                  placeholder="acme@company.com"
                  type="url"
                  value={getVideoURL()}
                  className="input flex-1"
                />
                <button
                  className="btn btn-primary"
                  onClick={() => void handleCopyLink()}
                >
                  <div className="flex flex-row items-center justify-center gap-1 ">
                    <div className="flex-shrink-0">{copyLinkText}</div>
                  </div>
                </button>
              </div>
              <div className="mt-3">
                <p className="pl-1 text-sm text-primary-300">
                  Choose a destination...
                </p>
                <div className="cursor-pointer pt-2 text-primary-200">
                  <div
                    onClick={() => void copyEmbedCode()}
                    className="group flex flex-row items-center gap-5 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <CodeBracketIcon className="h-5 w-5" />
                    <div>Copy embed code</div>
                    <ClipboardIcon className="ml-auto hidden h-5 w-5 group-hover:block" />
                  </div>
                  <div
                    onClick={handleTwitterClick}
                    className="group flex flex-row items-center gap-5 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <div className="text-xl">
                      <i className="ri-twitter-line ri-1x text-current"></i>
                    </div>
                    <div>Share in twitter</div>
                    <ArrowTopRightOnSquareIcon className="ml-auto hidden h-5 w-5 group-hover:block" />
                  </div>
                  <div
                    onClick={handleLinkedInClick}
                    className="group flex flex-row items-center gap-5 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <div className="text-xl">
                      <i className="ri-linkedin-line ri-1x text-current"></i>
                    </div>
                    <div>Share in linkedin</div>
                    <ArrowTopRightOnSquareIcon className="ml-auto hidden h-5 w-5 group-hover:block" />
                  </div>
                </div>
              </div>
            </div>
          </MyDialog>
        )}
      </>
    )
  );
}
