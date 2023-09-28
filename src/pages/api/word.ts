import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    word: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ word: "among" }); // TODO: do stuff
}