import { useSession } from "next-auth/react";
import Head from "next/head";
import MenuButton from "@/components/ui/menu";
import { Menu, Tab } from "@headlessui/react";
import { BoltIcon, ClockIcon, LinkIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

export default function Dashboard() {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Hello, {sessionData?.user.name}</title>
      </Head>
      <div className="container mx-auto min-h-screen w-full max-w-7xl  p-3 sm:p-4">
        <h1 className="font-heading text-4xl font-semibold">My Library</h1>
        <Tab.Group>
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
            <Tab.Panel>Content 1</Tab.Panel>
            <Tab.Panel>Content 2</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}
