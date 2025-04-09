/* eslint-disable @next/next/no-img-element */
"use client";
import { BlogData } from "@/_typs/blog";
import { getBlogList } from "@/utils/index";
import { useCallback, useEffect, useState } from "react";

import PostItem from "./PostItem";
export default function Blog() {
  const [data, setData] = useState<BlogData[]>();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (
      hasMore == true &&
      documentHeight - scrollTop - windowHeight < threshold
    ) {
      setLoading(true);
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    return;
  }, [hasMore]);

  useEffect(() => {
    if (!data) return;
    if (loading && hasMore) {
      getBlogList({ skip: data.length, limit: 10 }).then((res) => {
        console.log("get post list");
        console.log(data);
        let result = res.data;
        if (result.length == 0) {
          setHasMore(false);
        }
        setData((data) => data!.concat(result));
        setLoading(false);
      });
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (sessionStorage.getItem("blog")) {
      setData(JSON.parse(sessionStorage.getItem("blog") as string));
    } else
      getBlogList({ skip: data?.length || 0, limit: 10 }).then((res) => {
        let result = res.data;
        sessionStorage.setItem("blog", JSON.stringify(result));
        setData(result);
      });
  }, []);
  if (!data) return null;
  if (data.length == 0)
    return <div className="max-w-5xl mx-auto text-center">暂无文章</div>;
  return (
    <div className="max-w-5xl mx-auto">
      {data.map((item, index) => {
        return <PostItem key={item._id} {...item}></PostItem>;
      })}
      {(loading || !hasMore) && (
        <div className="h-[100px] flex justify-center">
          {loading && (
            <svg
              className="animate-spin mr-2 h-10 w-10 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                opacity={0.75}
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {/* {!hasMore && (
            <h2 className="mt-4" onClick={() => console.log(hasMore)}>
              到底啦
            </h2>
          )} */}
        </div>
      )}
    </div>
  );
}
const limit = 10;
const threshold = 10;
