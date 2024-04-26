import { options } from "@/app/api/auth/[...nextauth]/options";
import { CalendarIcon } from "@radix-ui/react-icons";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { ModeToggle } from "./ModeToggle";
import { NavLinks } from "./NavLinks";

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
          {session && session.user && <NavLinks role={session.user.role} />}
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          {session && session.user?.name && (
            <p className="text-sm text-foreground/80">
              Welcome, {session.user.name}
            </p>
          )}
          <nav className="flex items-center">
            <ModeToggle />
            {session && session.user && <LogoutButton />}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
