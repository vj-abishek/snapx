import { Menu, Transition } from "@headlessui/react";
import type { ReactElement } from "react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Button({
  text,
  children,
}: {
  text: string;
  children: ReactElement;
}) {
  return (
    <div className="w-full">
      <Menu
        as="div"
        className="relative float-right ml-auto inline-block w-full text-left"
      >
        <div>
          <Menu.Button className="btn btn-primary inline-flex w-full items-center justify-between !px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <span>{text}</span>
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100 dark:text-primary-300 dark:hover:text-primary-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="-right-15 absolute mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-primary-900 shadow-lg ring-1  ring-black ring-opacity-5 focus:outline-none dark:border dark:border-primary-400 dark:bg-primary-300">
            <div className="px-1 py-1 ">{children}</div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
