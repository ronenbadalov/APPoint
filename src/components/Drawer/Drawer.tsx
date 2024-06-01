"use client";
import { defaultPaths, paths } from "@/lib/paths";
import { Role } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { CalendarIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { businessLinks, clientLinks } from "../Header/NavLinks";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user.role;
  return createPortal(
    <>
      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 w-5/6 h-full shadow-lg transform transition-transform duration-300 ease-in-out z-[60] bg-inherit",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
          }
        )}
      >
        <div className="pl-6 pt-6">
          <X className="w-6 h-6" onClick={onClose} />
          {/* Drawer content */}
          <div className="my-6">
            <Link
              className="mr-6 flex items-center space-x-2"
              onClick={onClose}
              href={
                session?.user?.role
                  ? defaultPaths[session.user.role]
                  : paths.LOGIN
              }
            >
              <CalendarIcon width={24} height={24} />
              <span className="font-bold sm:inline-block">APPoint</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-2 text-sm lg:gap-6">
            {session?.user.role &&
              (role === Role.CUSTOMER ? clientLinks : businessLinks).map(
                (link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    onClick={onClose}
                    className={`transition-colors hover:text-foreground/60 ${
                      pathname === link.href
                        ? "text-foreground"
                        : "text-foreground/60"
                    }`}
                  >
                    {link.title}
                  </Link>
                )
              )}
          </nav>
        </div>
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black opacity-50 z-[50]"
        />
      )}
    </>,
    document.body
  );
};
