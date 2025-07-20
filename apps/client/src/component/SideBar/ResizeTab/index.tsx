import clsx from "clsx";
import { useAtomValue } from "jotai";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { sideBarOpenedAtom } from "../../../store/atom/common";

export default function ResizeTab({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  // 开始调整大小
  const startResizing = (e) => {
    if (sidebarRef.current == null) return null;
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarRef.current.getBoundingClientRect().width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  // 停止调整大小
  const stopResizing = () => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  // 调整大小
  const resize = (e) => {
    if (isResizing) {
      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(
        180,
        Math.min(400, startWidthRef.current + diff)
      );

      setSidebarWidth(newWidth);
    }
  };

  // 添加全局事件监听
  useEffect(() => {
    const handleMouseMove = (e) => resize(e);
    const handleMouseUp = () => stopResizing();

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isResizing]);

  const sideBarOpened = useAtomValue(sideBarOpenedAtom);
  return (
    <div
      ref={sidebarRef}
      className={clsx("relative", !sideBarOpened && "hidden")}
      style={{ width: sidebarWidth }}
    >
      <div className={clsx("h-full", className)}>{children}</div>
      <div
        onMouseDown={startResizing}
        className={clsx(
          "resize-tab absolute top-0 right-0 bottom-0 h-full w-0.5 bg-normal/50 cursor-col-resize transition-all duration-300 hover:w-1",
          isResizing && "w-1 bg-normal"
        )}
      ></div>
    </div>
  );
}
