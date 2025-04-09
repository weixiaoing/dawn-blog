"use client";

import { TiAdjustBrightness } from "react-icons/ti";
import { BsCloudSunFill } from "react-icons/bs";

import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { BsFillMoonStarsFill } from "react-icons/bs";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Moon from "../../../public/Header/moon.svg";
import Sun from "../../../public/Header/sun.svg";
import { HoverTag } from "../HoverTag";

export default function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggleDarkMode = async (isDarkMode: boolean) => {
    if (ref.current === null) return;
    await document.startViewTransition(() => {
      flushSync(() => {
        setIsDarkMode(isDarkMode);
      });
    }).ready;
    const { top, left } = ref.current.getBoundingClientRect();

    const x = left + 5;
    const y = top + 5;
    const right = window.innerWidth - y;
    const bottom = window.innerHeight - x;
    const maxRadius = Math.hypot(Math.max(y, right), Math.max(x, bottom));
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
          // `inset(0px at ${x}px ${y}px )`,
          // `inset(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 300,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  return (
    <div
      className="flex items-center"
      onClick={() => {
        toggleDarkMode(!isDarkMode);
        return false;
      }}
      ref={ref}
    >
      {" "}
      <HoverTag className="w-[24px] text-[18px]">
        {isDarkMode ? <BsMoonFill /> : <Sun />}
      </HoverTag>
    </div>
  );
}
