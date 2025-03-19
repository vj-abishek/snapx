import { useEffect, useState } from "react";

interface Props {
  start?: () => void;
}

export default function Countdown({ start }: Props) {
  const [number, setNumber] = useState(3);

  useEffect(() => {
    document.title = `Counting down...`;

    const interval = setInterval(() => {
      setNumber((prev) => prev - 1);
    }, 1000);

    if (number === 0) {
      clearInterval(interval);
      start && start();
    }

    return () => clearInterval(interval);
  }, [number, start]);

  return (
    <div className="font-dmSans fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-500/50 text-[14rem] font-bold backdrop-blur-lg ">
      {number}
    </div>
  );
}
