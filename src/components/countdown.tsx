import { useEffect, useState } from "react";

interface Props {
  start?: () => void;
}

export default function Countdown({ start }: Props) {
  const [number, setNumber] = useState(3);

  useEffect(() => {
    document.title = `Counting down...`;

    let interval: NodeJS.Timer | null = null;
    interval = setInterval(() => {
      setNumber((prev) => prev - 1);
    }, 1000);

    if (number === 0) {
      clearInterval(interval || 0);
      start && start();
    }

    return () => clearInterval(interval || 0);
  }, [number, start]);

  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-gray-500/50 font-dmSans text-[14rem] font-bold backdrop-blur-lg ">
      {number}
    </div>
  );
}
