import Lottie from "react-lottie";
import animationData from "src/assets/uploading.json";

export default function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-slate-400/25 backdrop-blur-lg">
      <Lottie options={defaultOptions} height={300} width={300} />
    </div>
  );
}
