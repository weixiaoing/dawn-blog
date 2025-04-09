"use client";
import { FiSend } from "react-icons/fi";

import MotionHeightHigher from "@/_components/motion/MotionHeightHigher";
import Bubble from "@/_components/UI/Bubble";
import Button from "@/_components/UI/button";
import Input from "@/_components/UI/form/Input";
import TextArea from "@/_components/UI/form/TextArea";
import clsx from "clsx";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
type props = {
  onSubmit?: (data: CommentInfo) => void;
  className?: string;
};

export type CommentInfo = {
  name: string;
  email?: string;
  avatar?: string;
  content: string;
};

export default function CommentBox(props: props) {
  const { onSubmit, className } = props;
  const emojiRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  // 初始化时从 localStorage 获取数据
  const [formData, setFormData] = useState<CommentInfo>(() => {
    const saved = localStorage.getItem("CommentInfo");

    return saved
      ? JSON.parse(saved)
      : {
          name: "123",
          email: "",
          avatar: "",
        };
  });
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    localStorage.setItem("CommentInfo", JSON.stringify(formData));
  }, [formData]);
  const handleEmojiSelect = (emoji: EmojiClickData) => {
    setContent((v) => v + emoji.emoji); // 插入表情
    setShowPicker(false); // 选择后关闭表情选择器
  };
  const handleSubmit = (e: any) => {
    e.preventDefault?.();
    onSubmit?.({ ...formData, content });
    // TODO: 发送评论到服务器
    // 成功后清除储存的草稿
    setContent("");
  };
  return (
    <>
      <div>
        <form action={handleSubmit} className={className}>
          <div className="flex justify-center gap-2">
            <Input
              className="focus:dark:bg-zinc-700/30"
              type="text"
              value={formData?.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prevData) => ({
                  ...prevData,
                  name: e.target.value,
                }));
              }}
              placeholder="昵称*"
            ></Input>
            <Input
              type="text"
              className="focus:dark:bg-zinc-700/30"
              value={formData?.email}
              placeholder="邮箱*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prevData) => ({
                  ...prevData,
                  email: e.target.value,
                }));
              }}
            ></Input>
            <Input
              type="text"
              className="focus:dark:bg-zinc-700/30"
              value={formData?.avatar}
              placeholder="头像网址"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prevData) => ({
                  ...prevData,
                  avatar: e.target.value,
                }));
              }}
            ></Input>
          </div>
          <div
            className="bg-slate-200/20 border-zinc-200 dark:bg-inherit dark:has-[:focus]:bg-zinc-700/30 has-[:focus]:shadow-inner
         border dark:border-zinc-200/5    has-[:focus]:border-slate-600/40 has-[:focus]:border
           mt-2 p-2 rounded-md  has-[:focus]:bg-inherit has-[:focus]:ring-1 ring-green-500/50"
          >
            <MotionHeightHigher>
              <TextArea
                className="h-full"
                placeholder="请输入评论吧"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setContent(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.ctrlKey && e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              ></TextArea>
            </MotionHeightHigher>
            <footer className="flex justify-between">
              <div>
                <li className="content-center relative  text-[20px] text-slate-400/80">
                  <Bubble
                    layout={
                      <Button onClick={() => setShowPicker(true)} type="button">
                        😊
                      </Button>
                    }
                  >
                    <EmojiPicker
                      lazyLoadEmojis
                      open={true}
                      onEmojiClick={handleEmojiSelect}
                    />
                  </Bubble>
                </li>
              </div>
              <div
                className={clsx(
                  "flex gap-4",
                  content.length === 0 && "opacity-0"
                )}
              >
                <li className="content-center text-[10px] text-slate-400/80">
                  {content.length} / 300
                </li>
                <li className="content-center">
                  <Button className="text-[12px]  " type="submit" animation>
                    <span className="flex items-center justify-center gap-1">
                      <FiSend className="text-[13px]" />
                      发送
                    </span>
                  </Button>
                </li>
              </div>
            </footer>
          </div>
        </form>
      </div>
    </>
  );
}
