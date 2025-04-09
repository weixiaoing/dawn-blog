"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "./UI/card";
import MotionToLeft from "./motion/MotionToLeft";

export default function Toc() {
  const [Article, setArticle] = useState<HTMLElement>();

  const headings = useMemo(() => {
    if (!Article) {
      return [];
    }
    return [...Article.querySelectorAll("h1,h2,h3,h4,h5,h6")];
  }, [Article]);
  const toc = useMemo(() => {
    return Array.from(headings).map((el, index) => {
      console.log("height", el.clientHeight);

      return {
        id: el.id,
        index: isNaN(index) ? -1 : index,
        title: el.textContent,
        depth: Number(el.tagName.split("")[1]),
        heading: el,
      };
    });
  }, [headings]);
  useEffect(() => {
    setArticle(document.getElementById("editor")!);
  }, []);
  // const list = useMemo(() => [1, 2, 3, 4], []);

  return (
    <>
      {toc.length > 0 && (
        <div>
          {" "}
          <MotionToLeft stiffness={100}>
            <Card>
              {toc?.map((item, index) => {
                return (
                  <div
                    onClick={() => {
                      item.heading.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className={`cursor-pointer text-[12px] text-gray-800/80 dark:text-slate-200 dark:text-slate-200/50 hover:dark:text-slate-200/80 hover:scale-105 duration-200 active:text-slate-200 text-ellipsis overflow-hidden whitespace-nowrap`}
                    style={{ marginLeft: `${(item.depth - 1) * 10}px` }}
                    key={item.index}
                  >
                    {item.title}
                  </div>
                );
              })}
            </Card>
          </MotionToLeft>
        </div>
      )}
    </>
  );
}
