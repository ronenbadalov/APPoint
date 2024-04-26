"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../../ui/button";

export const LogoutButton = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={async () => {
        await signOut();
      }}
    >
      <LogOut size={20} />
    </Button>
  );
};
