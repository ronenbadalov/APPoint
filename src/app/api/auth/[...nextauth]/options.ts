import { handleNewUserDetails, hashPassword, verifyPassword } from "@/lib/auth";
import { paths } from "@/lib/paths";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Role, User } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
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

        await handleNewUserDetails(newUser);

        return newUser;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}${paths.EXPLORE}`;
    },
    async session({ session, token }) {
      if (token.role as Role) session.user.role = token.role as Role;
      session.user.id = token.id as string;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        if ((user as User).role) token.role = (user as User).role as Role;
      }
      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role;
      }
      return token;
    },
  },
};
