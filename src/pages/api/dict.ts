import { client } from "@/lib/kv_client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req :NextApiRequest, res: NextApiResponse) {
    const dict: string[] = (await client.get("dict")) ?? [""];
    res.status(200).json({ dict });
}