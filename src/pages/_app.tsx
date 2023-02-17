import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";
import { DM_Sans, Poppins } from "@next/font/google";

import "../styles/globals.css";

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
  return (
    <main className={`${dmsans.variable} ${poppins.variable} font-dmSans`}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
