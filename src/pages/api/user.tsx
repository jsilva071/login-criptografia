import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import verifyToken from "@/helpers/server/verifyToken";

const prisma = new PrismaClient();

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
  const token = req.headers.authorization;
  const userData: any = verifyToken(token as string);
  const {userId} = userData;

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) throw new Error("User doesn't exist!")

  const data = {
    name: user.name,
    username: user.username,
    role: user.role,
    avatarUrl: user.avatarUrl
  }

  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL);

  res.status(200).json(data);
}
