"use client";
import { AiOutlineHome, AiOutlineRight } from "react-icons/ai";

import { AiOutlineMail } from "react-icons/ai";

import { FiGithub } from "react-icons/fi";
import { RiBilibiliFill } from "react-icons/ri";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Card from "../UI/card";

export default function HomeCard() {
  const constraintsRef = useRef(null);
  return (
    <motion.div
      animate={{ x: [200, 0], opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="w-[400px] h-[230px] "
    >
      <Card className="bg-white">
        <main className="h-[120px] flex  ">
          <motion.div
            ref={constraintsRef}
            className="flex  justify-center items-center w-[150px]"
          >
            <motion.div drag dragConstraints={constraintsRef}>
              <Image
                draggable={false}
                width={100}
                height={100}
                src="https://avatars.githubusercontent.com/u/93917549?v=4"
                alt="Dawn"
                title="Dawn"
                className="rounded-full mx-auto"
              />
            </motion.div>
          </motion.div>
          <div className="rounded-full self-center ml-[20px]  bg-[rgb(232,232,232)] w-[6px] h-[40px]"></div>
          <div className="flex items-center justify-center w-[200px]">
            <div>
              <div>哈喽 ! 我是</div>
              <div className="font-bold text-[40px]">Dawn</div>
            </div>
          </div>
        </main>
        <footer className="flex justify-center gap-2">
          {["React", "Node", "Next", "TailWind"].map((i) => (
            <span
              key={i}
              className="text-[12px] rounded-full bg-[rgb(244,244,245)] px-4 py-1"
            >
              {i}
            </span>
          ))}
        </footer>
      </Card>
      <footer className="flex mt-4 justify-center gap-4">
        <motion.li
          animate={{ y: [20, 0], opacity: [0, 1] }}
          transition={{ delay: 0.2 }}
        >
          <button className="rounded-full bg-[rgb(234,235,236)] w-[40px] h-[40px] flex items-center justify-center">
            <Link href={"/home"}>
              <AiOutlineHome />
            </Link>
          </button>
        </motion.li>
        <button className="rounded-full bg-[rgb(234,235,236)] w-[40px] h-[40px] flex items-center justify-center">
          <Link
            href={
              "https://space.bilibili.com/284987779?spm_id_from=333.1007.0.0"
            }
          >
            <RiBilibiliFill />
          </Link>
        </button>
        <button className="rounded-full bg-[rgb(234,235,236)] w-[40px] h-[40px] flex items-center justify-center">
          <Link href={"mailto:dawnot@foxmail.com"}>
            <AiOutlineMail />
          </Link>
        </button>
        <button className="rounded-full bg-[rgb(234,235,236)] w-[40px] h-[40px] flex items-center justify-center">
          <Link href={"https://github.com/weixiaoing"}>
            <FiGithub />
          </Link>
        </button>
        <button className="rounded-full bg-[rgb(234,235,236)] w-[40px] h-[40px] flex items-center justify-center">
          <Link href={"/home"}>
            <AiOutlineRight />
          </Link>
        </button>
      </footer>
    </motion.div>
  );
}
