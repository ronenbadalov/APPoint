import { defaultPaths } from "@/lib/paths";
import { ChildrenProps } from "@/types";
import { CalendarIcon } from "@radix-ui/react-icons";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";

export default async function Layout({ children }: ChildrenProps) {
  const session = await getServerSession(options);
  if (session && session.user && session.user.role) {
    redirect(defaultPaths[session.user.role]);
  }

  return (
    <div className="flex flex-col pt-5">
      <div className="w-[350px] mx-auto space-y-2 pb-5">
        <CalendarIcon width={128} height={128} className="mx-auto" />
        {children}
      </div>
    </div>
  );
}
