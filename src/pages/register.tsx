import HypedButton from "../components/marketing/hyped-button";
import { useSession } from "next-auth/react";

export default function Register() {
  const { data: sessionData } = useSession();
  if (sessionData) {
    window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <h1 className="max-w-3xl p-3 text-center font-heading text-4xl font-bold">
        Record, Share, Collaborate
        <br />
        Join SnapScreen Today!
      </h1>
      <div className="mt-4">
        <HypedButton text="Start Recording" />
      </div>
    </div>
  );
}
