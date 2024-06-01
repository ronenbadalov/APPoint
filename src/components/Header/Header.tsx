import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { LogoutButton } from "./LogoutButton";
import { MobileNav } from "./MobileNav";
import { ModeToggle } from "./ModeToggle";
import { NavLinks } from "./NavLinks";

export const Header = async () => {
  const session = await getServerSession(options);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex md:hidden items-center">
          <MobileNav />
        </div>
        <NavLinks />
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
