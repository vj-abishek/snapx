import { useSession } from "next-auth/react";
import Head from "next/head";
import MenuButton from "@/components/ui/menu";
import { Menu, Tab } from "@headlessui/react";
import { BoltIcon, ClockIcon, LinkIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import CreatedVideos from "@/components/recordings/createdVideos";
import type { GetServerSideProps } from "next";
import { api } from "@/utils/api";
import VideoLoading from "@/components/recordings/VideoLoading";
import { useRouter } from "next/router";
import Links from "@/components/LinkdedRecordings/Links";
import LinkedVideos from "@/components/LinkdedRecordings/LinkdedVideos";

export default function Dashboard() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { link } = router.query;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const tab = params.get("tab");
    if (tab) {
      setSelectedIndex(Number(tab));
    } else {
      setSelectedIndex(0);
    }
  }, [router.query]);

  const userVideos = api.video.getCurrentUserVideos.useQuery(
    {
      linkId: (link as string) || undefined,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!(sessionData?.user && (selectedIndex === 0 || link)),
    }
  );

  const links = api.video.getLinkdedVideos.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: !!sessionData?.user && selectedIndex === 1,
  });

  const handleTabChange = (index: number) => {
    router
      .push({
        query: `tab=${index}`,
      })
      .catch(console.error);
  };

  return (
    <>
      <Head>
        <title>Library | Snapx</title>
      </Head>
      <div className="container mx-auto min-h-screen w-full max-w-[70rem]  p-3 sm:p-4">
        <h1 className="font-heading text-4xl font-semibold">My Library</h1>
        <Tab.Group
          selectedIndex={selectedIndex || 0}
          onChange={handleTabChange}
        >
          <Tab.List
            className={
              "mt-9 flex w-max gap-1 space-x-1 rounded-xl bg-primary-100/20 p-1"
            }
          >
            <Tab as={Fragment}>
              {({ selected }) => (
                <div
                  className={`cursor-pointer rounded-lg ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400  focus:outline-none focus:ring-2  ${
                    selected
                      ? "bg-primary-900 "
                      : "bg-primary-700 hover:bg-primary-700/[0.12] "
                  } px-4 py-2 font-semibold  text-primary-100`}
                >
                  My Recordings
                </div>
              )}
            </Tab>
            <Tab>
              {({ selected }) => (
                <div
                  className={`cursor-pointer rounded-lg ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400  focus:outline-none focus:ring-2  ${
                    selected
                      ? "bg-primary-900 "
                      : "bg-primary-700 hover:bg-primary-700/[0.12] "
                  } px-4 py-2 font-semibold  text-primary-100`}
                >
                  Linked Recordings
                </div>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className={"mt-2 p-3"}>
            <Tab.Panel>
              {userVideos.isLoading ? (
                <VideoLoading />
              ) : (
                <CreatedVideos videos={userVideos.data ?? []} />
              )}
            </Tab.Panel>
            <Tab.Panel>
              {link && !userVideos.isLoading ? (
                <CreatedVideos videos={userVideos.data ?? []} />
              ) : (
                <Links data={links.data} />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}
