"use client";
import HomeTimeLine from "@/(app)/home/component/HomeTimeLine";
import TypeWriter from "@/_components/TypeWriter";
import Image from "next/image";
import "./page.css";

const description = "这里是一只正在学习前端,渴望学会全栈,梦想做开源的未晓";

export default function Home() {
  return (
    <>
      <div>
        <main>
          <div className="h-[80vh] pt-[150px] flex gap-10  justify-center">
            <div className="w-[600px]">
              <TypeWriter />
            </div>
            <div>
              <Image
                width={200}
                height={200}
                src="https://avatars.githubusercontent.com/u/93917549?v=4"
                alt="Dawn"
                title="Dawn"
                className="rounded-full mx-auto"
              />
            </div>
          </div>
          <div className="flex  mb-40 gap-4 mx-auto">
            <HomeTimeLine />
          </div>
        </main>
      </div>
    </>
  );
}
