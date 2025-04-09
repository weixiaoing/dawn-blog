"use client";
import clsx from "clsx";
import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
interface BubbleProps {
  layout: ReactNode; // Layout 部分的内容
  children: ReactNode; // Content 部分的内容
  onclose?: () => void;
}

interface BubbleRef {
  toggleContent: () => void; // 手动触发 Content 显现开关的方法
}
const Bubble = forwardRef(({ layout, children, onclose }: BubbleProps, ref) => {
  const [isVisible, setIsVisible] = useState(false); // 控制 Content 的显现状态
  const contentRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  // 手动触发 Content 显现开关
  useImperativeHandle(ref, () => ({
    toggleContent: () => {
      setIsVisible((prev) => !prev);
    },
  }));
  const handleClickOutside = (event: MouseEvent) => {
    if (
      contentRef.current &&
      !contentRef.current.contains(event.target as Node) &&
      layoutRef.current &&
      !layoutRef.current.contains(event.target as Node)
    ) {
      onclose?.();
      setIsVisible(false);
    }
  };
  const handleLayoutClick = () => {
    setIsVisible((prev) => !prev); // 点击 Layout 切换 Content 的显现状态
  };
  useEffect(() => {
    // 添加点击事件监听器
    document.addEventListener("mousedown", handleClickOutside);

    // 清理事件监听器
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative">
      <div ref={layoutRef} onClick={handleLayoutClick}>
        {layout}
      </div>
      <div
        ref={contentRef}
        className={clsx("absolute z-50", !isVisible && "hidden")}
      >
        {children}
      </div>
    </div>
  );
});
Bubble.displayName = "Bubble";

export default Bubble;
