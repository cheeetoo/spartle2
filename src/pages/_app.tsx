import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Spartle</title>
      </Head>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
