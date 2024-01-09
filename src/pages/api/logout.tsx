import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") return await POST(req, res);
  return res
    .status(StatusCodes.METHOD_NOT_ALLOWED)
    .send(ReasonPhrases.METHOD_NOT_ALLOWED);
}

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  const date = new Date('1970-01-01');
  const expires = `expires=${date}`
  const domain = `domain=${process.env.APP_DOMAIN}`;

  res.setHeader('set-cookie', `token=; path=/; ${domain}; ${expires}`);

  
  const data = {
    message: "User Logged Out!",
  }

  res.status(200).json(data);
}
