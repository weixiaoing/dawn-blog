"use client"
import Button from "@/_components/UI/button"
import Card from "@/_components/UI/card"
import { getFiles } from "@/utils"

import { useEffect, useState } from "react"

export default function Resource() {
  const [files, setFiles] = useState<
    {
      name: string
      path: string
      type: string
      _id: string
    }[]
  >([])
  useEffect(() => {
    const getFilesMutated = async () => {
      const res = await getFiles()
      console.log(res)
      setFiles(res)
    }
    getFilesMutated()
  }, [])
  return (
    <div className="mx-auto">
      <Card className="w-[800px] mx-auto bg-gray-400/10" border>
        <ul className="w-full h-[600px] overflow-auto min-h-[600px] space-y-2">
          {!Array.isArray(files) || files.length === 0 ? (
            <li>暂无资源</li>
          ) : (
            files.map((item) => (
              <li
                className="rounded-xl flex gap-2 bg-white p-2 relative"
                key={item._id}
              >
                <main className="flex-1 flex items-center">
                  <h2 className="text-[20px] ">{item.name}</h2>
                </main>

                <div className=" flex items-center space-x-4 ">
                  <a download href={item.path}>
                    <Button border>下载</Button>
                  </a>
                  <Button
                    border
                    onClick={() =>
                      window.navigator.clipboard.writeText(item.path)
                    }
                  >
                    分享文件
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  )
}
