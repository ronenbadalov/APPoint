import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.id;

  if (typeof userId !== "string") {
    return res.status(400).json({ message: "User ID must be a string." });
  }

  switch (req.method) {
    case "GET":
      // Fetch a single user by ID
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
      break;

    case "PUT":
      // Update a user's details
      const { name, email } = req.body;
      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: { name, email },
      });
      res.json(updatedUser);
      break;

    case "DELETE":
      // Delete a user
      await prisma.user.delete({
        where: { id: Number(userId) },
      });
      res.status(204).end();
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
