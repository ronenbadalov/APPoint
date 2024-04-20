import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

type Data = {
  message: string;
  error?: string;
};

type RoleRequestBody = {
  role: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
      error: "POST method is required.",
    });
  }

  const session = await getSession({ req });
  if (!session || !session.user.email) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: "User is not authenticated." });
  }

  const { role } = req.body as RoleRequestBody;

  // Validate the role is provided and valid
  if (!role || Role[role as keyof typeof Role] === undefined) {
    return res
      .status(400)
      .json({ message: "Bad Request", error: "Role is required." });
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: session.user.email },
    });
    if (user.role) {
      return res.status(400).json({
        message: "Bad Request",
        error: "Role already exists.",
      });
    }
    await prisma.user.update({
      where: { email: session.user.email },
      data: { role: role as Role },
    });
    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: "Failed to update role.",
    });
  }

  // Dummy response for the sake of example
  res.status(200).json({ message: "Role updated successfully" });
};
