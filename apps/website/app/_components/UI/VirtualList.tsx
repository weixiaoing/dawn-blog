"use client";
import { useEffect, useRef, useState } from "react";

interface VirtualListProps {
  /** 渲染列表 */
  list: any[];
  /** 容器高度 */
  containerHeight: number;
  /** 缓冲区数量 */
  bufferCount: number;
  //   渲染项
  renderItem: (item: string, index: number) => React.ReactNode;
}

export const VirtualList: React.FC<VirtualListProps> = ({
  list,
  containerHeight,
  bufferCount,
  renderItem,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** 当前滚动位置 */
  const [scrollTop, setScrollTop] = useState(0);
  /** 每个列表项的高度数组 */
  const [itemHeights, setItemHeights] = useState<number[]>([]);

  // 在组件挂载后计算每个列表项的高度
  useEffect(() => {
    // 获取每个列表项的高度
    const heights = itemRefs?.current?.map((ref) =>
      ref ? ref.offsetHeight : 0
    );
    setItemHeights(heights);
  }, [list]);

  // 计算所有列表项的总高度
  const docTotalHeight = itemHeights.reduce((sum, cur) => {
    return sum + cur;
  }, 0);

  // 计算当前视口内可见的列表项索引范围
  const getVisibleItemsIndex = () => {
    let accumulatedHeight = 0;
    let startIndex = 0;
    let endIndex = list.length - 1;
    // 迭代高度,计算出开始索引
    for (let i = 0; i < list.length; i++) {
      accumulatedHeight += itemHeights[i];
      if (accumulatedHeight > scrollTop) {
        startIndex = i;
        break;
      }
    }
    accumulatedHeight = 0;
    //根据渲染容器高度计算出结束索引
    for (let i = startIndex; i < list.length; i++) {
      accumulatedHeight += itemHeights[i];
      if (accumulatedHeight > containerHeight) {
        endIndex = i;
        break;
      }
    }
    // 返回的索引带有缓冲区
    return {
      startIndex: Math.max(startIndex - bufferCount, 0),
      endIndex: Math.min(endIndex + bufferCount, list.length - 1),
    };
  };
  // 根据当前滚动位置计算可见项的索引范围
  const { startIndex, endIndex } = getVisibleItemsIndex();

  // 处理滚动事件
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  // 在组件挂载时添加滚动事件监听器，并在组件卸载时移除监听器
  useEffect(() => {
    const viewport = containerRef.current;
    if (viewport) {
      viewport.addEventListener("scroll", handleScroll);
      return () => {
        viewport.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // 用于存储渲染的列表项
  const items = [];
  // 每个项的偏移量
  let topOffset = 0;
  // 使用for循环得到开始项的偏移量
  for (let i = 0; i < startIndex; i++) {
    topOffset += itemHeights[i] || 0;
  }
  // 根据计算的索引范围渲染可见项
  for (let i = startIndex; i <= endIndex; i++) {
    items.push(
      <div
        key={i}
        ref={(el) => {
          itemRefs.current[i] = el;
        }}
        style={{ position: "absolute", top: `${topOffset}px`, width: "100%" }}
      >
        {renderItem(list[i], i)}
      </div>
    );
    topOffset += itemHeights[i] || 0;
  }
  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        width: "100%",
        overflowY: "auto",
        position: "relative",
        zIndex: "0",
      }}
    >
      <div style={{ height: `${docTotalHeight}px`, position: "relative" }}>
        {items}
      </div>
    </div>
  );
};
