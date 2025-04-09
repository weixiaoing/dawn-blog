"use client";
import clsx from "clsx";
import dayjs from "dayjs";

import { getLocation } from "@/utils/common";
import React, { useState } from "react";
import { BiMessageRoundedDetail } from "react-icons/bi";
import Atag from "../UI/Atag";
import Avatar from "../UI/avatar";
import Button from "../UI/button";
import CommentBox, { CommentInfo } from "./ComentBox";
import { CommentType } from "./type";
type CommentProps = {
  avatar?: string;
  name?: string;
  content?: string | React.ReactNode;
  _id?: string;
  createdAt?: string;
  isSubComment?: boolean;
  children?: React.ReactNode;
  className?: string;

  reply: (data: CommentInfo) => void;
};

function Comment({
  avatar = "https://github.com/shadcn.png",
  name = "匿名用户",
  content = "test",
  _id = "1",
  children,
  className,
  reply,
  isSubComment = false,
  createdAt = "2024-10-15T02:07:50.678Z",
}: CommentProps) {
  const [replyShow, setReplyShow] = useState(false);
  return (
    <div className={className}>
      <main className={clsx("flex gap-4", { "scale-90": isSubComment })}>
        <div className="self-end">
          <Avatar src={avatar} alt={name} className="size-2" />
        </div>
        <div className="flex-1 group  ">
          <header className=" flex gap-4 items-center ">
            <span className=" font-semibold">{name}</span>
            <span className="text-gray-400 text-[0.6rem]">
              {dayjs(createdAt).format("YYYY 年 MM 月 DD 日 ")}
            </span>
          </header>
          <main className=" bg-zinc-200/50 relative  dark:bg-zinc-600/80 inline-block  rounded-lg rounded-tl-sm p-2 px-3 py-[1px] text-zinc-800 dark:text-zinc-200">
            <div>{content}</div>
            <div
              className="absolute right-0 bottom-0 translate-x-[50%]
                      translate-y-[50%]"
            >
              {
                <Button
                  onClick={() => {
                    setReplyShow((show) => !show);
                  }}
                >
                  <div
                    className=" bg-zinc-200/10 dark:bg-zinc-600/90 shadow-sm border hidden group-[:hover]:flex border-zinc-200 dark:border-opacity-10  text-opacity-10   
                       items-center justify-center
                      p-1
                       rounded-full "
                  >
                    <BiMessageRoundedDetail />
                  </div>
                </Button>
              }
            </div>
          </main>
        </div>
      </main>
      <footer>
        {replyShow && (
          <CommentBox
            onSubmit={async (data) => {
              try {
                const ip = await getLocation();
              } catch (error) {
                console.log(error);
              }

              reply(data);
              setReplyShow(false);
            }}
            className="py-4 "
          ></CommentBox>
        )}
        {children}
      </footer>
    </div>
  );
}

export default function Comments({
  data,
  reply,
}: {
  data: CommentType[];
  reply: (
    data: CommentInfo & {
      parent: string;
      levelIdArray: string[];
      level: number;
    }
  ) => void;
}) {
  if (data.length === 0)
    return <div className=" mt-10 text-center">暂无评论</div>;
  return (
    <div>
      {data?.map((item) => {
        return (
          <Comment
            reply={(data) => {
              reply({
                parent: item._id,
                levelIdArray: [item._id],
                level: 2,
                ...data,
              });
            }}
            className="mt-4"
            key={item._id}
            {...item}
          >
            {item.replies?.map((subItem) => {
              return (
                <Comment
                  reply={(data) => {
                    reply({
                      parent: subItem._id,
                      levelIdArray: [item._id, subItem._id],
                      level: 3,
                      ...data,
                    });
                  }}
                  {...subItem}
                  content={
                    subItem.level === 3 ? (
                      <>
                        <div>
                          <span>{"回复\t"}</span>
                          <Atag href={subItem.website || subItem.avatar}>
                            <span className="text-blue-400">
                              @{subItem.name}
                            </span>
                          </Atag>
                          <span>{":\t"}</span>
                        </div>
                        <>{subItem.content}</>
                      </>
                    ) : (
                      subItem.content
                    )
                  }
                  className="mt-4"
                  key={subItem._id}
                  isSubComment={true}
                ></Comment>
              );
            })}
          </Comment>
        );
      })}
    </div>
  );
}
