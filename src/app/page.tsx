import { paths } from "@/lib/paths";
import { ChildrenProps } from "@/types";
import { Role } from "@prisma/client";

const defaultRoutes = {
  [Role.BUSINESS]: paths.MY_BUSINESS,
  [Role.CUSTOMER]: paths.EXPLORE,
};

export default async function Page({ children }: ChildrenProps) {
  return <>{children}</>;
}
