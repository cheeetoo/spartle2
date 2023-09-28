import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/kv";

type ResponseData = {
    word: string
}
export const client = createClient({
    url: process.env.KV_REST_API_URL ?? '',
    token: process.env.KV_REST_API_TOKEN ?? '',
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const word = await client.get("word") as string;
    res.status(200).json({ word }); // TODO: do stuff
}