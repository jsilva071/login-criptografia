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
  if (req.method === "POST") return await post(req, res);
  return res
    .status(StatusCodes.METHOD_NOT_ALLOWED)
    .send(ReasonPhrases.METHOD_NOT_ALLOWED);
}

export async function post(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const pepper = process.env.PEPPER;
  const passwordWithPepper = password + pepper;

  const passwordMatch = await bcrypt.compare(passwordWithPepper, user.password);

  if (!passwordMatch) {
    throw new Error("Senha incorreta");
  }

  const payload = {
    userId: user.id,
    username: user.username,
  };
  
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

  const d = new Date();
  d.setHours(d.getHours() + 1);
  const expires = `expires=${d.toUTCString()}`
  const domain = `domain=${process.env.APP_DOMAIN}`;

  res.setHeader('set-cookie', `token=${token}; ${domain}; path=/; ${expires}; HttpOnly; Secure; SameSite=Strict`);
  
  const data = {
    message: "User Logged!",
    token
  }

  res.status(200).json(data);
}
