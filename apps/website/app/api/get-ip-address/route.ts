import { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/headers";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { get } = headers();
  const ip =
    get("x-real-ip") ||
    get("x-forwarded-for") ||
    get("remote-addr") ||
    get("cf-connecting-ip");
  console.log(ip);

  return new Response(JSON.stringify({ ip }));
}
