// import { nextAuthOptions } from "@/lib/auth";
// import { NextApiRequest, NextApiResponse } from "next";
// import NextAuth from "next-auth/next";

// function auth(
//   req: NextApiRequest,
//   res: NextApiResponse
// ): ReturnType<typeof NextAuth> {
//   return NextAuth(req, res, nextAuthOptions(req, res));
// }
// export { auth as GET, auth as POST };

import NextAuth from "next-auth";
import { options } from "./options";

const handler = NextAuth(options);
export { handler as GET, handler as POST };
