import Modal from "@/_components/UI/modal";
import Markdown from "markdown-to-jsx";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose, AiOutlineFullscreen } from "react-icons/ai";

export default function PostModal({
  content,
  postId,
  children,
}: { content: string; postId?: string } & PropsWithChildren) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {createPortal(
        <Modal visible={open} onCancel={() => setOpen(false)}>
          <div className="fixed flex gap-2 text-xl  top-1 right-2">
            <Link
              href={`/blog/${postId}`}
              className=" border rounded-full  p-2 border-gray-400/20"
            >
              <AiOutlineFullscreen />
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="border rounded-full  p-2 border-gray-400/20"
            >
              <AiOutlineClose />
            </button>
          </div>
          <div className=" bg-white mt-10 border border-gray-400/20 rounded-md   p-2 px-6  w-[800px] min-h-[800px] ">
            <Markdown className="prose">{content}</Markdown>
          </div>
        </Modal>,
        document.body
      )}
      <div onClick={() => setOpen(true)}>{children}</div>
    </>
  );
}
