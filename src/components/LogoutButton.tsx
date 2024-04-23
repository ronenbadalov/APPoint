"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export const LogoutButton = () => {
  const { data: session } = useSession();
  return (
    <Button
      onClick={async () => {
        await signOut();
      }}
    >
      Log Out
    </Button>
  );
};
