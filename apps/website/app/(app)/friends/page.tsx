"use client";
import MotionToUp from "@/_components/motion/MotionToUp";
import { useMemo } from "react";
import "./index.css";
export default function Friends() {
  const data = useMemo(() => {
    return [
      {
        name: "bakaptr",
        avatar:
          "https://uni-storage-1253266055.cos.ap-guangzhou.myqcloud.com/qavatar.webp",
        website: "https://qxq.moe/",
      },
    ];
  }, []);
  return (
    <div className="mx-auto  max-w-screen-md">
      <h1>朋友们</h1>
      <MotionToUp>
        <div className="mt-10 w-full grid grid-cols-3">
          {data.map((item) => {
            return (
              <div
                id="hover-box"
                key={item.name}
                className="flex  space-y-2 p-4 flex-col items-center rounded-md "
              >
                <img
                  className="w-[60px] h-[60px] rounded-xl"
                  src={item.avatar}
                  alt={item.name}
                />
                <p>{item.name}</p>
              </div>
            );
          })}
        </div>
      </MotionToUp>
    </div>
  );
}
