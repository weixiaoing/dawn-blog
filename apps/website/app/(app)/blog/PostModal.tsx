import Modal from "@/_components/UI/modal";
import { addLikes } from "@/utils"
import { message } from "antd"
import Markdown from "markdown-to-jsx"
import Link from "next/link"
import { PropsWithChildren, useState } from "react"
import { createPortal } from "react-dom"
import {
  AiOutlineClose,
  AiOutlineFullscreen,
  AiOutlineLike,
} from "react-icons/ai"

export default function PostModal({
  content,
  postId,
  children,
}: { content: string; postId: string } & PropsWithChildren) {
  const [open, setOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <>
      {contextHolder}
      {createPortal(
        <Modal visible={open} onCancel={() => setOpen(false)}>
          <div className="fixed flex gap-2 text-xl  top-1 right-2">
            <button
              onClick={async () => {
                await addLikes(postId)
                messageApi.success("点赞成功")
              }}
              className="border rounded-full  p-2 border-gray-400/20"
            >
              <AiOutlineLike />
            </button>
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
          <div className="py-10">
            <div className=" bg-white  border border-gray-400/20 rounded-md    py-4 px-6  w-[800px] min-h-[800px] ">
              <Markdown className="prose">{content}</Markdown>
            </div>
          </div>
        </Modal>,
        document.body
      )}
      <div onClick={() => setOpen(true)}>{children}</div>
    </>
  )
}
