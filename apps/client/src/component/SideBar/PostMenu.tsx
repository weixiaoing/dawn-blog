import { RiAddFill } from "react-icons/ri"
import {
  DeleteOutlined,
  FileAddOutlined,
  FileTextOutlined,
  RightOutlined,
} from "@ant-design/icons"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createPostAPI, deletePostAPI, getList } from "../../api/post"

const DropdownMenu = ({ display }: { display: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [data, setData] = useState<{ _id: string; title: string }[]>([])

  useEffect(() => {
    getList().then((res) => {
      setData(res)
    })
  }, [])

  const ChildMenu = () => {
    if (!data) return
    return (
      <ul className="ml-2">
        {data.map((item) => (
          <li
            role="button"
            onClick={() => {
              navigate(`/blog/${item._id}`)
            }}
            key={item._id}
            className="overflow-x-hidden group/item p-2 flex  hover:bg-gray-400/15 rounded-sm  "
          >
            <FileTextOutlined className="opacity-50" />
            <span className="text-ellipsis ml-2 text-sm overflow-hidden whitespace-nowrap">
              {item.title}
            </span>

            <div className="flex-1"></div>
            <DeleteOutlined
              onClick={async (e) => {
                e.stopPropagation()
                await deletePostAPI(item._id)
                setData((v) => {
                  return v?.filter((atom) => atom._id != item._id)
                })
              }}
              className="opacity-0 group-hover/item:opacity-100"
            />
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="transition-all duration-1000 flex flex-col max-h-[800px] overflow-auto ">
      <header
        role="button"
        onClick={() => {
          navigate("/table")
        }}
        className="flex rounded-sm p-2 text-opacity-80"
      >
        <span className=" px-1 rounded-sm hover:bg-neutral-300/40">
          <RightOutlined
            onClick={(e) => {
              e.stopPropagation()
              setOpen(!open)
            }}
            className={clsx(open && "rotate-90", "size-4 transition-all ")}
          />
        </span>
        <span className="ml-2"> {display}</span>
        <div className="flex-1"></div>
        <button
          className="hover:bg-black/10 rounded-sm p-1"
          onClick={async (e) => {
            e.stopPropagation()
            const res = await createPostAPI()
            navigate(`/blog/${res.data.data._id}`)
          }}
        >
          <RiAddFill className="opacity-50 size-full hover:opacity-100" />
        </button>
      </header>
      {open && <ChildMenu />}
    </div>
  )
}
export default function PostMenu() {
  return <DropdownMenu display={<span>文章</span>}></DropdownMenu>
}
