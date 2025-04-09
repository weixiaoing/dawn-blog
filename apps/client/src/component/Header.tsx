import { TbLayoutSidebarRightCollapse } from "react-icons/tb"
import { MenuOutlined } from "@ant-design/icons"
import { useAtom } from "jotai"
import { useNavigate } from "react-router-dom"
import { sideBarOpenedAtom } from "../store/atom/common"
import { SocketStatus } from "./socket/socketStatus"

export const Header = () => {
  const [sideBarOpened, setSideBarOpened] = useAtom(sideBarOpenedAtom)

  return (
    <header className="h-10 flex group/header p-2">
      {!sideBarOpened && (
        <button
          className="opacity-0 group-hover/header:opacity-100 outline-none "
          onClick={() => {
            setSideBarOpened(!sideBarOpened)
          }}
        >
          <TbLayoutSidebarRightCollapse className="opacity-80" />
        </button>
      )}

      {/* <SocketStatus /> */}
    </header>
  )
}
