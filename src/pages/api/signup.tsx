import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

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
  const { name, username, role, avatarUrl, email, password } = req.body;

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const pepper = process.env.PEPPER;
  const passwordWithPepper = password + pepper;

  // Hash da senha utilizando o salt gerado
  const hashedPassword = await bcrypt.hash(passwordWithPepper, salt);

  const userData = {
    name,
    username,
    role,
    avatarUrl,
    email,
    password: hashedPassword,
    salt,
  };

  await prisma.user.create({
    data: userData,
  });

  res.status(200).json({ message: "User created!" });
}
