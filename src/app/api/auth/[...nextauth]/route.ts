import { nextAuthOptions } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth/next";

function auth(
  req: NextApiRequest,
  res: NextApiResponse
): ReturnType<typeof NextAuth> {
  return NextAuth(req, res, nextAuthOptions(req, res));
}
export { auth as GET, auth as POST };
