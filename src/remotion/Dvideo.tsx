import { AbsoluteFill } from "remotion";
import { api } from "@/utils/api";
import Default from "./templates/Default";
import Ali from "./templates/Ali";
import Presentation from "./templates/Presentation";
import { useEffect, useRef, useState } from "react";
import domtoimage from "dom-to-image";

interface DynamicVideoProps {
  videoUid: string;
  screenUid: string;
  thumbnail?: string;
}

export default function DynamicVideo({
  screenUid,
  videoUid,
  thumbnail,
}: DynamicVideoProps) {
  const screenURL = api.video.getURL.useQuery(
    { id: screenUid },
    { staleTime: Infinity }
  );
  const videoURL = api.video.getURL.useQuery(
    { id: videoUid },
    { staleTime: Infinity }
  );

  if (screenURL.isLoading || videoURL.isLoading) {
    return null;
  }

  return (
    <AbsoluteFill>
      <Default
        screenURL={screenURL?.data?.signedUrl || null}
        videoURL={videoURL?.data?.signedUrl || null}
      />
      {/* <Ali
        screenURL={screenURL?.data?.signedUrl || null}
        videoURL={videoURL?.data?.signedUrl || null}
      /> */}

      {/* <Presentation
        screenURL={screenURL?.data?.signedUrl || null}
        videoURL={videoURL?.data?.signedUrl || null}
      /> */}
    </AbsoluteFill>
  );
}
