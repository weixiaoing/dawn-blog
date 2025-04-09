import { useEffect, useRef, useState } from "react";
const extra = 4;
type props = {
  list?: [];
};
export default function VirtualScroll({ items, renderItem }) {
  const listRef = useRef(null);
  const itemHeight = 200; // 每个帖子的高度,todo change
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  let [render, setRender] = useState({});
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      setContainerHeight(containerRef.current.getBoundingClientRect().height);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;

    const visibleCount = Math.ceil(containerHeight / itemHeight); // 可见的帖子数量
    const buffer = Math.ceil(visibleCount * 2); // 缓冲区的帖子数量
    const totalHeight = itemHeight * items.length; // 总高度

    let start = 0;
    let end = start + visibleCount + buffer;
    setRender({ start, end });
    const handleScroll = () => {
      const scrollTop = list!.scrollTop;
      start = Math.floor(scrollTop / itemHeight);
      end = start + visibleCount + buffer;

      if (end > items.length) {
        end = items.length;
      }
      setRender({ start, end });

      list.style.height = `${totalHeight}px`;
      list.style.transform = `translateY(${scrollTop}px)`;
    };

    list.addEventListener("scroll", handleScroll);

    return () => {
      list.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  return (
    <>
      <div ref={containerRef}>
        <div ref={listRef} className="virtual-list">
          {items?.slice(render.start, render.end).map((item, index) => (
            <div
              key={index}
              className="virtual-list-item"
              style={{ height: `${itemHeight}px` }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
