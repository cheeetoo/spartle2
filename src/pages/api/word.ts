import { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/lib/kv_client";

type ResponseData = {
  word: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const word = (await client.get("word")) as string;
  res.status(200).json({ word }); // TODO: do stuff
}
