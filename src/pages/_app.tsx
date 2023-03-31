import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import Layouts from "src/layouts";
import Layout from "@/components/layout/sidebar";
import { useRouter } from "next/router";
import Head from "next/head";
import "remixicon/fonts/remixicon.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      <NextNProgress
        color="#b91c1c"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Head>
        <title>SnapX - 🚀 Record your video</title>
      </Head>

      <div className={`font-dmSans flex flex-auto`}>
        <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-primary-100 text-center text-4xl text-primary-900 lg:hidden">
          We are not avaliable for mobile devices yet. Please use a desktop
        </div>
        {Layouts.includes(router.pathname) && <Layout />}
        <main
          className={`w-full shadow-xl dark:bg-primary-100 dark:text-gray-100 ${
            Layouts.includes(router.pathname) ? "pl-[15rem]" : ""
          }`}
        >
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
