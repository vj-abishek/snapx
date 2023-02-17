import { signIn } from "next-auth/react";
export default function HypedButton({ text }: { text: string }) {
  return (
    <a
      href="#_"
      onClick={() => void signIn("google")}
      className="ease group relative z-30 box-border inline-flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-md bg-indigo-600 px-8 py-3 font-bold text-white ring-1 ring-indigo-300 ring-offset-2 ring-offset-indigo-200 transition-all duration-300 hover:ring-offset-indigo-500 focus:outline-none"
    >
      <span className="absolute bottom-0 right-0 -mb-8 -mr-5 h-20 w-8 translate-x-1 rotate-45 transform bg-white opacity-10 transition-all duration-300 ease-out group-hover:translate-x-0"></span>
      <span className="absolute top-0 left-0 -mt-1 -ml-12 h-8 w-20 -translate-x-1 -rotate-45 transform bg-white opacity-10 transition-all duration-300 ease-out group-hover:translate-x-0"></span>
      <span className="relative z-20 flex items-center text-sm">
        <svg
          className="relative mr-2 h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        {text}
      </span>
    </a>
  );
}
