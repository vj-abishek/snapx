import * as React from "react";
import * as Toast from "@radix-ui/react-toast";

interface Props {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  description?: string;
  children?: React.ReactNode;
}

const SToast = ({ title, open, setOpen, description, children }: Props) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">{title}</Toast.Title>
        <Toast.Description asChild>
          <div className="ToastDescription">{description}</div>
        </Toast.Description>
        {children}
        {/* <Toast.Action
          className="ToastAction"
          asChild
          altText="Goto schedule to undo"
        >
          <button className="Button small green">Undo</button>
        </Toast.Action> */}
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};

export default SToast;
