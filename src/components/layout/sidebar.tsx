/* eslint-disable @next/next/no-img-element */
import MenuButton from "@/components/ui/menu";
import { Menu } from "@headlessui/react";
import {
  BoltIcon,
  BuildingLibraryIcon,
  HomeIcon,
  LinkIcon,
  VideoCameraIcon,
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-[4rem] flex-shrink-0 bg-primary-800 py-1 font-dmSans dark:bg-primary-200 dark:text-primary-900  lg:w-[15rem] lg:px-3 lg:py-8">
      <div className="h-12">
        <MenuButton text="Create new">
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => void router.push("/record")}
                  className={`${
                    active
                      ? "bg-dark-accent text-white dark:bg-dark-accent"
                      : "text-gray-900 dark:text-primary-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <BoltIcon
                    className={`ml-2 h-5 w-5  ${
                      active
                        ? "text-white dark:text-primary-900"
                        : "text-primary-300 dark:text-primary-600"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="ml-2">Quick recording</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active
                      ? "bg-dark-accent text-white dark:bg-dark-accent"
                      : "text-gray-900 dark:text-primary-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <LinkIcon
                    className={`ml-2 h-5 w-5  ${
                      active
                        ? "text-white dark:text-primary-900"
                        : "text-primary-300 dark:text-primary-600"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="ml-2">Instant link</span>
                </button>
              )}
            </Menu.Item>
          </>
        </MenuButton>
      </div>
      <div className="mt-7 flex flex-col">
        <Link
          href="/ui"
          className={`mb-1 flex rounded-lg p-2 pl-3 font-normal transition-colors hover:bg-primary-600 dark:hover:bg-primary-300
           ${
             router.pathname === "/ui"
               ? "bg-primary-600 dark:bg-primary-300"
               : ""
           }`}
        >
          <HomeIcon className="mr-3 h-5 w-5 text-primary-300 dark:text-primary-600" />
          <span>Home</span>
        </Link>
        <Link
          href="/dashboard"
          className={`flex rounded-lg p-2 pl-3 font-normal transition-colors hover:bg-primary-600  dark:hover:bg-primary-300
          ${
            router.pathname === "/dashboard"
              ? "bg-primary-600 dark:bg-primary-300"
              : ""
          }`}
        >
          <VideoCameraIcon className="mr-3 h-5 w-5 text-primary-300 dark:text-primary-600" />
          <span>My library</span>
        </Link>
      </div>

      <div className="absolute bottom-3 w-[89%]">
        <div className="my-1 flex cursor-pointer items-center rounded-lg border border-gray-300 p-3 dark:border-primary-400">
          <div className="h-11 w-11  rounded-full">
            <img
              src={sessionData?.user.image || "/images/user.png"}
              alt="user"
              className="rounded-full"
            />
          </div>
          <div className="ml-3 py-3 text-sm">
            <p className="font-semibold">{sessionData?.user.name}</p>
            <p className="text-xs">Account settings</p>
          </div>
        </div>
        {/* <p className="mt-5 text-center text-xs">Made with ❤️ in india</p> */}
      </div>
    </div>
  );
}
