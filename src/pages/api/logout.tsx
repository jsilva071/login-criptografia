import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

type ResponseData = {
  message: string;
};

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
  res: NextApiResponse<ResponseData>
) {

  const date = new Date('1970-01-01');
  const expires = `expires=${date}`
  const domain = `domain=${process.env.APP_DOMAIN}`;
  res.setHeader('set-cookie', `token=; ${domain}; path=/; ${expires}; HttpOnly; Secure; SameSite=Strict`);
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL);
  
  const data = {
    message: "User Logged Out!",
  }

  res.status(200).json(data);
}
