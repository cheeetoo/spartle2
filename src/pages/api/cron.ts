import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/lib/kv_client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
      ["https://www.googleapis.com/auth/spreadsheets"]
    ),
  });

  const spreadsheetId = "1TgKKKg3mjgNiGr2vkf29DAZaPGitcM0CKadMCgnZy7A";
  const range = "Sheet1";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  // get values and set first cell of first column to word in kv
  const rows = response.data.values ?? [];
  client.set("word", rows[0][0]);

  const dict: string[] = JSON.parse(await client.get("dict") ?? "");
  if (!dict.includes(rows[0][0])) {
    dict.push(rows[0][0]);
    client.set("dict", JSON.stringify(dict));
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
