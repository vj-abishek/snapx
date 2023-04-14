/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
    .from("videos")
    .createSignedUploadUrl(id as string);

  if (!data) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  if (data.token) {
    res.json({ token: data.token });
  }
}
