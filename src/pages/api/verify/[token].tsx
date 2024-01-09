import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import verifyToken from "@/helpers/server/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") return await get(req, res);
  return res
    .status(StatusCodes.METHOD_NOT_ALLOWED)
    .send(ReasonPhrases.METHOD_NOT_ALLOWED);
}

export async function get(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {token} = req.query;
  const userData: any = verifyToken(token as string);

  const data = {
    userId: userData.userId
  }

  res.status(200).json(data);
}
