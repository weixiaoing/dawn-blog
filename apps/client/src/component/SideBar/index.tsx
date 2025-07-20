import clsx from "clsx";
import { useAtom } from "jotai";
import React, { FC, PropsWithChildren } from "react";
import { TbLayoutSidebarLeftCollapse, TbWritingSign } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { sideBarOpenedAtom } from "../../store/atom/common";
import PostMenu from "./PostMenu";
import ResizeTab from "./ResizeTab";

export const MenuItemContainer: FC<
  PropsWithChildren & React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={clsx(
        "hover:bg-normal/40  rounded-md px-2 py-1 cursor-pointer",
        className
      )}
      role="button"
    >
      {children}
    </div>
  );
};

export const IconButton: FC<
  PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>
> = ({ children, className, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-md p-1 text-neutral-500 hover:bg-neutral-400/20 size-6 active:bg-neutral-400/40 flex items-center justify-center text-center ",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const [sideBarOpened, setSideBarOpened] = useAtom(sideBarOpenedAtom);
  return (
    <ResizeTab
      className={clsx("group/sidebar px-3 bg-normal/30 py-2 font-medium ")}
    >
      <div className="h-full flex flex-col">
        <MenuItemContainer className=" flex gap-2 justify-between ">
          {/* <IconButton
            className="size-8"
            onClick={() => {
              navigate("/login");
            }}
          >
            <BsDoorOpen className="size-full" />
          </IconButton> */}
          <div className="flex ">
            <IconButton
              className="size-8"
              onClick={() => {
                setSideBarOpened(false);
              }}
            >
              <TbLayoutSidebarLeftCollapse className="size-full" />
            </IconButton>
            <IconButton className="size-8">
              <TbWritingSign className="size-full" />
            </IconButton>
          </div>
        </MenuItemContainer>
        <div className="flex mt-2 flex-col flex-1 gap-2 overflow-auto ">
          <MenuItemContainer>
            <header role="button" onClick={() => navigate("/")}>
              仪表盘
            </header>
          </MenuItemContainer>
          <PostMenu />
          <MenuItemContainer onClickCapture={() => navigate("/file")}>
            <span>文件</span>
          </MenuItemContainer>
        </div>
      </div>
    </ResizeTab>
  );
};

export default SideBar;
