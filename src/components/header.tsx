import { Bars3Icon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Drawer from "@/components/primitives/drawer";

interface Props {
  children: React.ReactNode;
}

export default function Header({ children }: Props) {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div
        style={{ userSelect: "none" }}
        onClick={() => setOpen(true)}
        className="flex items-center gap-4"
      >
        <Bars3Icon className="h-6 w-6 text-primary-100 lg:hidden" />
        {children}
      </div>

      <Drawer open={open} onClose={onClose} />
    </>
  );
}
