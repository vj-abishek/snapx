/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import Record from "@/pages/record";
import MyDialog from "@/components/primitives/dialog";
import { useState } from "react";
import { api, trpcClient } from "@/utils/api";
import * as timeago from "timeago.js";
import { signIn, useSession } from "next-auth/react";
import type { GetServerSideProps } from "next";
import type { InstantLink, User } from "@prisma/client";
import Head from "next/head";

interface Props {
  linkInfo: string | null;
}

export default function RecordWithId({ linkInfo }: Props) {
  const parsedLinkInfo: (InstantLink & { user: User }) | null = linkInfo
    ? JSON.parse(linkInfo)
    : null;
  const [open, setOpen] = useState(true);
  const [canShowRecorder, setCanShowRecorder] = useState(false);
  const session = useSession();

  const onClose = () => {
    setOpen(false);
  };

  const handeClick = async () => {
    if (!session.data) {
      await signIn("google");
    }
    setCanShowRecorder(true);
  };

  return (
    <>
      <Head>
        <title>Record a response to {parsedLinkInfo?.user?.name}</title>
        <meta
          name="description"
          content={
            parsedLinkInfo?.description ||
            "You are invited to record a response. Create a response instantly"
          }
        />
      </Head>
      {canShowRecorder && (
        <Record
          title={parsedLinkInfo?.title}
          description={parsedLinkInfo?.description}
        />
      )}
      {!canShowRecorder && (
        <MyDialog
          title={`Record a response to ${parsedLinkInfo?.user?.name || ""}`}
          open={open}
          onClose={onClose}
          canClose={false}
        >
          {parsedLinkInfo ? (
            <>
              <div className="mt-2">
                <h3 className="pl-1">{parsedLinkInfo?.title}</h3>
              </div>
              <div className="mt-2">
                <p className="pl-1 text-sm">{parsedLinkInfo?.description}</p>
              </div>
              <div className="mt-2">
                <p className="pl-1 text-xs text-primary-400">
                  {parsedLinkInfo?.expiresAt &&
                    parsedLinkInfo?.expiresAt !== "never" &&
                    `This link will expire  ${timeago.format(
                      parsedLinkInfo.expiresAt
                    )}`}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                {parsedLinkInfo && (
                  <button className="btn btn-primary" onClick={handeClick}>
                    Record a response
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="mt-2">
              <p>This link got expired</p>
            </div>
          )}
        </MyDialog>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  if (!id) {
    return { props: { linkInfo: null } };
  }

  try {
    const data = await trpcClient.video.getLink.query({
      linkId: id as string,
    });

    if (!data) {
      return { props: { linkInfo: null } };
    }

    console.log(data);

    // check if the data is expired
    if (data.expiresAt && data.expiresAt !== "never") {
      const expiresAt = new Date(data?.expiresAt);
      const now = new Date();
      if (expiresAt < now) {
        return { props: { linkInfo: null } };
      }
    }

    const linkInfo = JSON.stringify(data);
    return { props: { linkInfo } };
  } catch (err) {}

  return { props: { linkInfo: null } };
};
