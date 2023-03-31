/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from "@/utils/api";
import { generateExpiryDate } from "@/utils/generateExpiry";
import { LinkIcon } from "@heroicons/react/20/solid";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import MyDialog from "../primitives/dialog";
import * as timeago from "timeago.js";
import Toast from "../primitives/toast";
import { Action } from "@radix-ui/react-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Linkmodal({ open, onClose }: Props) {
  const linkMutation = api.video.createLink.useMutation();
  const [modalTitle, setModalTitle] = useState("Create an instant link");
  const [linkId, setLinkId] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const timerRef = React.useRef(0);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = form.elements.namedItem("title") as HTMLInputElement;
    const description = form.elements.namedItem(
      "description"
    ) as HTMLTextAreaElement;
    const expiresIn = form.elements.namedItem("expiresIn") as HTMLInputElement;

    console.log(title, description, expiresIn);

    if (!title.value) {
      return;
    }

    const timeStamp = generateExpiryDate(expiresIn.value);
    const linkId = nanoid(10);
    linkMutation.mutate({
      title: title.value,
      description: description.value,
      expiresAt: timeStamp,
      linkId,
    });
  };

  const reset = () => {
    setLinkId(null);
    setModalTitle("Create an instant link");
    console.log(linkId);
  };

  const copyToClipboard = () => {
    if (linkId === null) return;

    setToastOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setToastOpen(true);
    }, 100);

    navigator.clipboard
      .writeText(`${window.location.origin}/r/${linkId}`)
      .catch(console.error);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (linkMutation.isSuccess) {
      console.log("im called");
      setLinkId(linkMutation.data.linkId);
      setModalTitle("Copy the link");
    }
  }, [linkMutation.isSuccess, linkMutation.data?.linkId]);

  return (
    <>
      <MyDialog open={open} onClose={onClose} title={modalTitle}>
        {linkId !== null ? (
          <>
            <div className="mt-2">
              <p className="mb-2 pl-1 text-primary-300">
                {linkMutation.data?.title}
              </p>
              <div>
                <p className="mb-2 max-w-sm pl-1 text-sm text-primary-400">
                  {linkMutation.data?.description}
                </p>
              </div>
              <div className="flex h-11 w-full items-center rounded-md  bg-primary-800 p-4">
                <div>{`${window.location.origin}/r/${linkId}`}</div>
                <button
                  className="btn btn-action btn-normal ml-auto"
                  onClick={copyToClipboard}
                >
                  <ClipboardIcon className="h-5 w-5" />
                </button>
              </div>
              <p>
                <span className="pl-1 text-sm text-xs text-gray-500">
                  {linkMutation.data?.expiresAt === "never"
                    ? "Your link will never expire"
                    : `Your link will expire on ${timeago.format(
                        linkMutation?.data?.expiresAt || "never"
                      )}`}
                </span>
              </p>
              <div className="mt-2 flex justify-end">
                <button className="btn btn-action" onClick={reset}>
                  New link
                </button>
                <button className="btn btn-primary ml-2 " onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Instant links let you easily get video recordings from others.
                Just share the link and they can record a response.
              </p>
            </div>

            <form className="mt-5" onSubmit={onSubmit}>
              <label htmlFor="title" className="pl-1">
                Enter title
              </label>

              <div className="mt-1">
                <input
                  required
                  type="text"
                  disabled={linkMutation.isLoading}
                  id="title"
                  name="title"
                  className="input w-full"
                  placeholder="Get customer feedback"
                />
              </div>
              <div className="mt-3">
                <label htmlFor="description" className="pl-1">
                  Description
                </label>
              </div>
              <div className="mt-1">
                <textarea
                  className="input w-full"
                  id="description"
                  name="description"
                  disabled={linkMutation.isLoading}
                  placeholder="Get feedback on your product or service."
                ></textarea>
              </div>
              <div className="mt-3">
                <label htmlFor="expiresIn" className="flex-shrink-0 pl-1">
                  Expires in
                </label>

                <select
                  disabled={linkMutation.isLoading}
                  id="countries"
                  name="expiresIn"
                  defaultValue={"never"}
                  className="mt-1 inline-block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <option value="never">Never</option>
                  <option value="1D">1 day</option>
                  <option value="2D">2 days</option>
                  <option value="5D">5 days</option>
                  <option value="1W">1 week</option>
                  <option value="1M">1 month</option>
                  <option value="3M">3 months</option>
                </select>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="btn btn-action"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linkMutation.isLoading}
                  className="btn btn-primary ml-4"
                >
                  Create Link
                </button>
              </div>
            </form>
          </div>
        )}
      </MyDialog>
      <Toast
        open={toastOpen}
        setOpen={setToastOpen}
        title="Copied to clipboard"
        description="You can now share the link with others"
      />
    </>
  );
}
