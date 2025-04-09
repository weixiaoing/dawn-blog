import { TbLayoutSidebarLeftCollapse } from "react-icons/tb"
import { BsDoorOpen } from "react-icons/bs"
import { EditOutlined, LeftOutlined, LoginOutlined } from "@ant-design/icons"
import clsx from "clsx"
import { useAtom } from "jotai"
import React, { FC, PropsWithChildren } from "react"
import { useNavigate } from "react-router-dom"
import { createPostAPI } from "../../api/post"
import { sideBarOpenedAtom } from "../../store/atom/common"
import PostMenu from "./PostMenu"

const MenuItemContainer: FC<
  PropsWithChildren & React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={clsx("hover:bg-gray-400/15 rounded-sm p-2 ", className)}
      role="button"
    >
      {children}
    </div>
  )
}

const SideBar: React.FC = () => {
  const navigate = useNavigate()
  const [sideBarOpened, setSideBarOpened] = useAtom(sideBarOpenedAtom)
  return (
    <aside
      className={clsx(
        "group/sidebar transition-all   box-content h-[100vh] w-0  bg-gray-400/5  relative flex overflow-y-hidden  flex-col overflow-x-hidden text-ellipsis whitespace-nowrap ",
        sideBarOpened && "w-[200px] py-1 px-2"
      )}
    >
      <div className=" flex flex-col gap-2">
        <MenuItemContainer className="flex gap-2 justify-between cursor-default">
          <button
            onClick={() => {
              localStorage.setItem("Expire", "")
              navigate("/login")
            }}
            className={clsx(
              "h-6 w-6 rounded-sm hover:bg-neutral-300 flex items-center justify-center   text-center opacity-0 group-hover/sidebar:opacity-100"
            )}
          >
            <BsDoorOpen className="opacity-80" />
          </button>
          <div className=" flex gap-2">
            <button
              onClick={() => {
                setSideBarOpened(false)
              }}
              className={clsx(
                "h-6 w-6 rounded-sm hover:bg-neutral-300 flex items-center justify-center  text-center opacity-0 group-hover/sidebar:opacity-100"
              )}
            >
              <TbLayoutSidebarLeftCollapse className="opacity-80 " />
            </button>
            <button
              onClick={async () => {
                const res = await createPostAPI()
                navigate(`/blog/${res.data.data._id}`)
              }}
              className={clsx(
                "h-6 w-6 rounded-sm hover:bg-neutral-300  text-center opacity-0 group-hover/sidebar:opacity-100"
              )}
            >
              <EditOutlined className="opacity-80" />
            </button>
          </div>
        </MenuItemContainer>
        <MenuItemContainer>
          <header
            className="opacity-80"
            role="button"
            onClick={() => navigate("/")}
          >
            仪表盘
          </header>
        </MenuItemContainer>

        <PostMenu />

        <MenuItemContainer onClickCapture={() => navigate("/file")}>
          <span className="opacity-80">文件</span>
        </MenuItemContainer>
      </div>
    </aside>
  )
}

export default SideBar
