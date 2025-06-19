import { createSummary, getSummary } from "@/utils";
import type { NextRequest } from "next/server";
import openai from "../config";

export const dynamic = "force-dynamic";
export const POST = async (req: NextRequest) => {
  const { postId, content, language } = await req.json();
  const sucessResponse = (data) => {
    return new Response(
  JSON.stringify(data),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      }
    );
  }
  
  const text = content as string; //文章内容
  const lang = language || ("zh" as string); //语言
  const sqlResult = await getSummary(postId);//查询是否有对应摘要记录

  let summary = "";

  //没有摘要记录就选择重新请求摘要
  if (sqlResult.data.length > 0) {
    sucessResponse({
      summary: sqlResult.data[0]?.content,
      source: "db-cache",
    })
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
  //不存在重新让AI进行摘要,插入数据库中
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
