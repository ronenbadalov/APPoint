import { ModeToggle } from "@/components/ModeToggle";
import { ChildrenProps } from "@/types";
import { CalendarIcon } from "@radix-ui/react-icons";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: ChildrenProps) {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-4 flex justify-between items-center sticky top-0 w-full">
        <a className="flex items-center space-x-2" href="/">
          <CalendarIcon width={32} height={32} />
          <span className="hidden font-bold sm:inline-block">APPoint</span>
        </a>
        <ModeToggle />
      </div>
      <div className="w-[350px] mx-auto space-y-2 pb-5">
        <CalendarIcon width={128} height={128} className="mx-auto" />
        {children}
      </div>
    </div>
  );
}
