import { supabase } from "@/lib/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const { data } = await supabase.storage
    .from("thumbs")
    .createSignedUrl(`${id as string}`, 60 * 60 * 24 * 7);

  if (!data) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  if (data) {
    const response = await fetch(data.signedUrl);
    if (!response.ok) {
      return res.status(response.status).end();
    }

    const d = await response.arrayBuffer();
    res.setHeader("Cache-Control", "public, max-age=300");
    res.end(Buffer.from(d));
  }
}
