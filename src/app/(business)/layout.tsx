import { defaultPaths, paths } from "@/lib/paths";
import { ChildrenProps } from "@/types";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";

export default async function Layout({ children }: ChildrenProps) {
  const session = await getServerSession(options);
  if (!session) redirect(paths.LOGIN);
  if (session && session.user && !session.user.role) {
    return redirect(paths.SELECT_ROLE);
  }
  if (session && session.user && session.user.role === Role.CUSTOMER) {
    return redirect(defaultPaths.CUSTOMER);
  }
  return <>{children}</>;
}
