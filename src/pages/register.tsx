import { signIn, useSession } from "next-auth/react";
import { BoltIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionData) {
      router.push("/dashboard").catch(console.error);
    }
  }, [router, sessionData]);

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center">
      <h1 className="font-heading max-w-3xl p-3 text-center">
        Record, Share, Collaborate
        <br />
        Join SnapScreen Today!
      </h1>
      <button
        onClick={() => void signIn("google")}
        className="btn btn-primary inline-flex items-center justify-center"
      >
        <BoltIcon className="mr-2 h-5 w-5" />
        <span>Start Recording</span>
      </button>
    </div>
  );
}
