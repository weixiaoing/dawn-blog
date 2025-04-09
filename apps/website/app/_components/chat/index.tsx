"use client";
import { headers } from "next/headers";
import { useEffect, useState } from "react";
import { createContext } from "vm";
import { Skeleton } from "../UI/Skeleton";
import Button from "../UI/button";
import Card from "../UI/card";
import Input from "../UI/input";
import CommentList from "../comment/commentList";
import { CommentType } from "../comment/type";
import useSocket from "./hook";

export default function Chat({
  room,
  ...props
}: {
  room: string;
  [key: string]: any;
}) {
  const { socket } = useSocket({ room });
  const [text, setText] = useState<string>("");
  const [message, setMessage] = useState<CommentType>({
    content: "",
    name: "",
    email: "",
    website: "",
  });
  const [list, setList] = useState<CommentType[]>([]);
  const [SkeletonShow, setSkeletonShow] = useState<boolean>(true);
  const SocketContext = createContext();

  useEffect(() => {
    if (socket) {
      socket.on("chatList", (data) => {
        console.log("i get", data);
        setList((list) => {
          return [data, ...list];
        });
      });
      socket.on("listInit", (data) => {
        setList(data);
        console.log("link room sucess ", data);
        setSkeletonShow(false);
      });
      socket.on("subChatOut", (data) => {
        console.log("subChatOut", data);
        setList((list) => {
          return list.map((item) => {
            if (item._id === data.parentId) {
              return {
                ...item,
                replies: [...item.replies, data],
              };
            } else {
              return item;
            }
          });
        });
      });
    }
  }, [socket]);
  if (!socket) return;

  const send = async (e: any) => {
    e.preventDefault();
    const ip = headers().get("x-real-ip");
    console.log(ip);

    if (message?.content.trim() !== "") {
      socket.emit("send", {
        room,
        message,
      });
      setMessage({
        ...message,
        content: "",
      });
    } else {
      alert("不能为空");
    }
  };

  return (
    <Card
      className="min-h-[600px] bg-white mt-10"
      header={
        <>
          <div className="grid grid-cols-3 gap-2 ">
            <input
              placeholder="昵称"
              className="bg-[rgb(241,242,243)] text-[12px]  rounded-md p-2 py-1"
              type="text"
              value={message?.name}
              onChange={(e) => {
                setMessage({
                  ...message,
                  name: e.target.value,
                });
              }}
            />
            <input
              placeholder="邮箱"
              className="bg-[rgb(241,242,243)] text-[12px] rounded-md p-2 py-1"
              type="text"
              value={message.email}
              onChange={(e) => {
                setMessage({
                  ...message,
                  email: e.target.value,
                });
              }}
            />
            <input
              placeholder="网址"
              className="bg-[rgb(241,242,243)] text-[12px] rounded-md p-2 py-1"
              type="text"
              value={message.avatar}
              onChange={(e) => {
                setMessage({
                  ...message,
                  avatar: e.target.value,
                });
              }}
            />
          </div>
          <div className="bg-[rgb(241,242,243)] mt-4 rounded-md p-2">
            <Input
              border={false}
              placeholder="请输入回复内容"
              type="textarea"
              className="min-h-[6rem] mx-h-[12rem] bg-transparent p-1"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMessage({
                  ...message,
                  content: e.target.value,
                })
              }
              value={message.content}
            ></Input>
            <footer className="flex flex-row-reverse ">
              <Button onClick={send} className="bg-blue-600 text-white">
                send
              </Button>
            </footer>
          </div>
        </>
      }
    >
      <div className="flex-grow">
        <ul className="w-auto  ">
          {list.length !== 0 && <CommentList socket={socket} comments={list} />}
          {!SkeletonShow && list.length === 0 && (
            <li className="mt-[30%] text-center">
              <h1>暂无聊天记录</h1>
            </li>
          )}
          {SkeletonShow && (
            <>
              <Skeleton className="rounded-full w-[60px] h-[60px] " />
              <Skeleton className="w-[50%] h-5 " />
            </>
          )}
        </ul>
      </div>
    </Card>
  );
}
