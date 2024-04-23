import { paths } from "@/lib/paths";
import { ChildrenProps } from "@/types";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { options } from "./api/auth/[...nextauth]/options";

const defaultRoutes = {
  [Role.BUSINESS]: paths.MY_BUSINESS,
  [Role.CUSTOMER]: paths.EXPLORE,
};

export default async function Page({ children }: ChildrenProps) {
  const session = await getServerSession(options);
  console.log(session);
  const headersList = headers();
  const domain = headersList.get("x-forwarded-host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "";
  const pathname = headersList.get("x-invoke-path") || "";
  console.log(pathname);
  console.log(domain);
  return <>{children}</>;
}
