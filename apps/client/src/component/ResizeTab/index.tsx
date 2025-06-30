import clsx from "clsx"
import { FC, PropsWithChildren, useEffect, useRef, useState } from "react"

export default function ResizeTab({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  // 开始调整大小
  const startResizing = (e) => {
    if (sidebarRef.current == null) return null
    setIsResizing(true)
    startXRef.current = e.clientX
    startWidthRef.current = sidebarRef.current.getBoundingClientRect().width
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }

  // 停止调整大小
  const stopResizing = () => {
    setIsResizing(false)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }

  // 调整大小
  const resize = (e) => {
    if (isResizing) {
      const diff = e.clientX - startXRef.current
      const newWidth = Math.max(
        180,
        Math.min(400, startWidthRef.current + diff)
      )

      setSidebarWidth(newWidth)
    }
  }

  // 添加全局事件监听
  useEffect(() => {
    const handleMouseMove = (e) => resize(e)
    const handleMouseUp = () => stopResizing()

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isResizing])

  return (
    <div
      ref={sidebarRef}
      style={{ width: sidebarWidth }}
      className={clsx("relative", className)}
    >
      {children}
      <div
        onMouseDown={startResizing}
        className="resize-tab absolute top-0 right-0 bottom-0 h-full w-1 cursor-col-resize"
      ></div>
    </div>
  )
}
