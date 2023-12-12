import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/lib/kv_client";
import { readFile } from "fs/promises";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authToken = (req.headers.authorization || "").split("Bearer ").at(1);

  if (!authToken || authToken != process.env.CRON_SECRET) {
    res.status(401).end();
    return;
  }

  const sheets = google.sheets({
    version: "v4",
    auth: new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"), // chatgpt stuff, fixed an error so keeping
      ["https://www.googleapis.com/auth/spreadsheets"],
    ),
  });

  const spreadsheetId = "1kYgqyt9psLIKzaK-7oK2z3zHa_XxsbXRvsUUBpQD5EU";
  const range = "Sheet1";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  // get values and set first cell of first column to word in kv
  const rows = response.data.values ?? [];
  const word: string = rows[0]
    ? rows[0][0]
    : (await (await fetch("/api/word")).json()).word;
  client.set("word", word.toLowerCase());

  const dictKv: string[] = (await client.get("dict")) ?? [""];
  const dictFile = (
    await readFile(path.join(process.cwd(), "public", "words.txt"), "utf-8")
  ).split("\n");
  if (![...dictKv, ...dictFile].includes(word)) {
    const newDict: string[] = (await client.get("dict")) ?? [""];
    newDict.push(word.toLowerCase());
    client.set("dict", JSON.stringify(newDict));
  }

  // sheets magick
  rows?.shift();
  rows.push([""]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: rows,
    },
  });

  res.status(200).end();
}
