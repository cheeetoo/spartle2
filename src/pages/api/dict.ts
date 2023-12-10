import { client } from "@/lib/kv_client";
import { readFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const dictKv: string[] = (await client.get("dict")) ?? [""];
  const dictFile = (
    await readFile(path.join(process.cwd(), "public", "words.txt"), "utf-8")
  ).split("\n");
  res.status(200).json([...dictKv, ...dictFile]);
}
