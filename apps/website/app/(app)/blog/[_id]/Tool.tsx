"use client";

import Button from "@/_components/UI/button"
import { addLikes } from "@/utils"
import { message } from "antd"
import { AiOutlineLike } from "react-icons/ai"

export default function Tool({ id }: { id: string }) {
  const [messageApi, contextHolder] = message.useMessage()
  return (
    <div className="space-y-4">
      {contextHolder}
      <div>
        <Button
          onClick={async () => {
            await addLikes(id)
            messageApi.success("点赞成功")
          }}
          className="size-5 border rounded-full"
        >
          <AiOutlineLike className="size-full" />
        </Button>
      </div>
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        回到顶部
      </button>
    </div>
  )
}
