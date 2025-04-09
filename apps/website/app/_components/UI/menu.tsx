"use client";
import clsx from "clsx";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
type props = {
  children: React.ReactNode;
  className?: string;
};
export default function Menu({ children, className }: props) {
  const [open, setOpen] = useState(false);
  return (
    <main className={clsx("flex items-center relative sm:flex-col", className)}>
      <AiOutlineMenu
        onClick={() => setOpen((open) => !open)}
        className="sm:hidden"
      />
      {open ? (
        <div className="absolute top-[0%] left-[150%] inline-block bg-white z-10 sm:hidden">
          <div className="absolute translate-x-[-90%] translate-y-2 border-[10px] border-l-0 rounded-full  border-transparent   border-r-white "></div>
          {children}
        </div>
      ) : (
        <div className=" space-x-2 items-center hidden sm:flex ">
          {children}
        </div>
      )}
    </main>
  );
}
