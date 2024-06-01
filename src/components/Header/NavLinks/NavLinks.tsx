"use client";
import { defaultPaths, paths } from "@/lib/paths";
import { Role } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const clientLinks = [
  { title: "Explore", href: paths.EXPLORE },
  { title: "My appointments", href: paths.MY_APPOINTMENTS },
];

export const businessLinks = [
  { title: "My business", href: paths.MY_BUSINESS },
  { title: "Calendar", href: paths.CALENDAR },
];

export const NavLinks = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user.role;
  return (
    <div className="mr-4 hidden md:flex">
      <Link
        className="mr-6 flex items-center space-x-2"
        href={
          session?.user?.role ? defaultPaths[session.user.role] : paths.LOGIN
        }
      >
        <CalendarIcon width={24} height={24} />
        <span className="font-bold sm:inline-block">APPoint</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {session?.user.role &&
          (role === Role.CUSTOMER ? clientLinks : businessLinks).map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className={`transition-colors hover:text-foreground/60 ${
                pathname === link.href
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              {link.title}
            </Link>
          ))}
      </nav>
    </div>
  );
};
