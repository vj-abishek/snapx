import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Snapx.</title>
      </Head>
      <div className="container mx-auto min-h-screen w-full max-w-[70rem]  p-3 sm:p-4">
        <h1 className="text-3xl font-semibold">Welcome to snapx.</h1>
        <iframe
          width="560"
          height="315"
          src="http://localhost:3000/embed/d39JWuwKAB"
          title="Research / Trends in ai - 19 March 2023"
          allow="accelerometer; autoplay; clipboard-write;"
          frameBorder="0"
          className="rounded-xl"
          allowFullScreen={true}
        ></iframe>
      </div>
    </>
  );
}
