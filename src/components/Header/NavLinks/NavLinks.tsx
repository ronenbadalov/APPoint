"use client";
import { paths } from "@/lib/paths";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const clientLinks = [{ title: "Explore", href: paths.EXPLORE }];

const businessLinks = [
  { title: "My Business", href: paths.MY_BUSINESS },
  { title: "Calendar", href: paths.CALENDAR },
];

export const NavLinks = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user.role;
  return (
    <nav className="flex items-center gap-4 text-sm lg:gap-6">
      {session?.user.role &&
        (role === Role.CUSTOMER ? clientLinks : businessLinks).map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className={`transition-colors hover:text-foreground/60 ${
              pathname === link.href ? "text-foreground" : "text-foreground/60"
            }`}
          >
            {link.title}
          </Link>
        ))}
    </nav>
  );
};
