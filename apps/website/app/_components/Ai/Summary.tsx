"use client";
import { FaRobot } from "react-icons/fa";

import Card from "@/_components/UI/card";
import { useEffect, useState } from "react";

export default function Summary({
  postId,
  content,
  langeuage,
}: {
  postId: string;
  content: string;
  langeuage?: string;
}) {
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetch(`/api/ai/summary`, {
      method: "POST",
      body: JSON.stringify({ postId, content, langeuage }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setSummary(res.summary);
      });
  }, [postId, content, langeuage]);
  return (
    <Card
      border
      className="mt-4 bg-white dark:bg-inherit dark:text-slate-200"
      header={
        <span className="text-sm flex  space-x-2">
          <span className="flex items-center justify-center">
            <FaRobot className="text-blue-300" />
          </span>{" "}
          <span>AI生成的摘要</span>
        </span>
      }
    >
      <p className="text-[12px] mb-10">{summary}</p>
    </Card>
  );
}
