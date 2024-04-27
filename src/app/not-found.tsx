"use client";
import { defaultPaths, paths } from "@/lib/paths";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Custom404() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) return router.push(paths.LOGIN);

    if (session && session.user && !session.user.role) {
      return router.push(paths.SELECT_ROLE);
    }
    if (session && session.user && session.user.role === Role.CUSTOMER) {
      return router.push(defaultPaths.CUSTOMER);
    }
  }, [session]);
}
