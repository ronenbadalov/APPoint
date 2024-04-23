import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

export function nextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
      newUser: "/signup",
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      }),
      CredentialsProvider({
        id: "login",
        name: "Login",
        credentials: {
          email: {
            label: "Email",
            type: "email",
          },
          password: {
            label: "Password",
            type: "password",
          },
        },
        async authorize(credentials, req) {
          if (!credentials) return null;

          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });
          if (!user) {
            return null;
          }

          const passwordCorrect = await verifyPassword(
            credentials.password,
            user.password || ""
          );

          if (!passwordCorrect) {
            return null;
          }

          return user;
        },
      }),
      CredentialsProvider({
        id: "signup",
        name: "Signup",
        credentials: {
          email: {
            label: "Email",
            type: "email",
          },
          password: {
            label: "Password",
            type: "password",
          },
          name: {
            label: "Name",
            type: "text",
          },
          role: {
            label: "Role",
            type: "text",
          },
        },
        async authorize(credentials, req) {
          if (!credentials) return null;

          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });
          if (user) {
            throw new Error("User already exists");
          }

          const hashedPassword = await hashPassword(credentials.password);
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.name,
              role: credentials.role as Role,
            },
          });

          return newUser;
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async signIn({ user, account }) {
        const cookieStore = cookies();
        const role = cookieStore.get("role")?.value;
        const userFromDb = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
        });
        if (!userFromDb && account?.provider === "google" && !role) {
          const token = jwt.sign(
            { action: "allow_selecting_role" },
            "random_key"
          );
          return "/select-role?token=" + token;
        }

        return true;
      },
      async redirect({ url, baseUrl }) {
        return baseUrl;
      },
      async session({ session, token }) {
        const cookieStore = cookies();
        const role = cookieStore.get("role")?.value;
        const userFromDb = await prisma.user.findFirst({
          where: {
            email: token.email,
          },
        });
        if (userFromDb && !userFromDb.role && role && token.email) {
          await prisma.user.update({
            where: {
              email: token.email,
            },
            data: {
              role: role as Role,
            },
          });
          cookieStore.delete("role");
        }

        return {
          ...session,
          user: {
            ...session.user,
            role: token.role,
            id: token.id,
            randomKey: token.randomKey,
          },
        };
      },
      async jwt({ token, user }) {
        if (user) {
          const u = user as unknown as any;
          return {
            ...token,
            id: u.id,
            role: u.role,
            randomKey: u.randomKey,
          };
        }
        return token;
      },
    },
  };
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}
