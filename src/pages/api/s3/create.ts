import s3 from "@/lib/s3";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  s3.listObjects("recordr-develop")
    .then((objects) => {
      res.status(200).json({ message: objects.join(", ") });
    })
    .catch((err: any) => {
      res.status(500).json({ message: err.message });
    });
}
