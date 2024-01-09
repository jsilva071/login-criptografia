import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") return await post(req, res);
  return res
    .status(StatusCodes.METHOD_NOT_ALLOWED)
    .send(ReasonPhrases.METHOD_NOT_ALLOWED);
}

export async function post(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL);

  if (user) {
    res.status(200).json({
      usernameAvailable: false
    })
  }

  res.status(200).json({
    usernameAvailable: true
  });
}
