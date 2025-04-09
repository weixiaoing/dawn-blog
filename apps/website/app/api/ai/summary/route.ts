import { createSummary, getSummary } from "@/utils";
import type { NextRequest } from "next/server";
import openai from "../config";

export const dynamic = "force-dynamic";
export const POST = async (req: NextRequest) => {
  const { postId, content, language } = await req.json();

  const text = content as string;
  const lang = language || ("zh" as string);
  const sqlResult = await getSummary(postId);
  console.log("summaryData", sqlResult);  

  let summary = "";
  // 查询数据库中是否有summary

  if (sqlResult.data.length > 0) {
    return new Response(
      JSON.stringify({
        summary: sqlResult.data[0]?.content,
        source: "db-cache",
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      }
    );
  }
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Summarize this in "${lang}" language:
"${text}"

CONCISE SUMMARY:`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  summary = completion.choices[0].message.content!;

  //  插入数据库
  await createSummary(postId, summary);

  return new Response(
    JSON.stringify({
      summary,
      source: "openai",
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    }
  );
};
