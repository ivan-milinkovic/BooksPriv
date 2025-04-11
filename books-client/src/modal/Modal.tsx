import { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export const Modal = ({ children }: PropsWithChildren) => {
  const frameRef = useRef<HTMLElement>(null);
  if (!frameRef.current) frameRef.current = document.createElement("div");

  useEffect(() => {
    const modalContainer = document.getElementById("modal-container")!;
    modalContainer.appendChild(frameRef.current!);
    return () => {
      modalContainer.removeChild(frameRef.current!);
    };
  }, []);

  return createPortal(<>{children}</>, frameRef.current);
};
