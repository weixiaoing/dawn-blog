"use client";
import { AiOutlineArrowUp } from "react-icons/ai";
import AiModal from "../AIChat/AiModal";
import Button from "../UI/button";
import ThemeSwitcher from "./ThemeSwitcher";
export function ScrollTop() {
  return (
    <div className=" flex flex-col space-y-2 items-center fixed bottom-5 right-2 z-20  ">
      <AiModal></AiModal>
      <ThemeSwitcher></ThemeSwitcher>
      <Button>
        <AiOutlineArrowUp
          onClick={() => {
            scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
      </Button>
    </div>
  );
}

export const test = () => {};
