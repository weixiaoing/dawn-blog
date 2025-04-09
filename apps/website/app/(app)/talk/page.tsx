"use client";
import type { Talk } from "@/_typs/talk";
import { getTalksByPage } from "@/utils";
import { useEffect, useState } from "react";

export default function Talk() {
  const [talks, setTalks] = useState<Talk[]>();
  useEffect(() => {
    getTalksByPage({ page: 1, pageSize: 10 }).then((res) => setTalks(res.list));
  }, []);
  if (!talks) return;
  return (
    <div>
      <div className="max-w-2xl mx-auto">
        {" "}
        {talks.map((talk) => {
          return (
            <div key={talk._id}>
              {" "}
              <p>{talk.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
