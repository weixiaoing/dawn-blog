"use client";
import { useEffect, useState } from "react";
import useSocket from "../chat/hook";
// import type { CommentBaseProps } from "./types";

import CommentBox from "./ComentBox";
import Comments from "./Comments";
import { CommentType } from "./type";

export default function CommentRoot({
  room,
}: {
  room?: string;
  className?: string;
  // socket: Socket;
}) {
  const { socket } = useSocket({ room });
  const [comments, setComments] = useState<CommentType[]>([]);
  useEffect(() => {
    if (socket) {
      socket.on("chatList", (data) => {
        console.log("i get", data);
        setComments((list) => {
          return [data, ...list];
        });
      });
      socket.on("listInit", (data) => {
        setComments(data);
        console.log("link room sucess ", data);
        // setSkeletonShow(false);
      });
      socket.on("subChatOut", (data) => {
        console.log("subChatOut", data);
        setComments((list) => {
          return list.map((item) => {
            if (item._id === data.levelIdArray?.[0]) {
              return {
                ...item,
                replies: [data, ...item.replies],
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
  return (
    <>
      <div>
        <CommentBox
          onSubmit={(message) => {
            if (message.content.trim() !== "") {
              console.log(message);
              socket.emit("send", {
                room,
                message,
              });
            } else {
              alert("不能为空");
            }
          }}
        ></CommentBox>
        <Comments
          reply={(data) => {
            console.log("replyData", data);
            socket.emit("reply", {
              postId: room,
              ...data,
            });
          }}
          data={comments}
        ></Comments>
      </div>
    </>
  );
}
