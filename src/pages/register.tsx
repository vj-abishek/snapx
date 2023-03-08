import { signIn, useSession } from "next-auth/react";
import { BoltIcon } from "@heroicons/react/20/solid";

export default function Register() {
  const { data: sessionData } = useSession();
  if (sessionData) {
    window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <h1 className="max-w-3xl p-3 text-center font-heading">
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
