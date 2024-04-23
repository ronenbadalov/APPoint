import { options } from "@/app/api/auth/[...nextauth]/options";
import { CalendarIcon } from "@radix-ui/react-icons";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { LogoutButton } from "../LogoutButton";
import { ModeToggle } from "../ModeToggle";

export const Header = async () => {
  const session = await getServerSession(options);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <CalendarIcon width={24} height={24} />
            <span className="font-bold sm:inline-block">APPoint</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/signup"
            >
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center [&>*]:border-0">
            <ModeToggle />
            {session && session.user && <LogoutButton />}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
