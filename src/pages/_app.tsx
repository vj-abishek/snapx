import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";
import { DM_Sans, Poppins } from "@next/font/google";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import Layouts from "src/layouts";
import Layout from "@/components/layout/sidebar";
import { useRouter } from "next/router";

const dmsans = DM_Sans({
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "600", "800"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

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
      <div
        className={`${dmsans.variable} ${poppins.variable} flex flex-auto font-dmSans`}
      >
        {Layouts.includes(router.pathname) && <Layout />}
        <main className={` w-full dark:bg-primary-100 dark:text-gray-100`}>
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
