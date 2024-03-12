import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/auth";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany();
  res.json(users);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { email, name, password } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: "Could not create the user." });
  }
}
