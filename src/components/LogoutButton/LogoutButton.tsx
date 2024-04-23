"use client";
import { signOut } from "next-auth/react";
import { IoIosLogOut } from "react-icons/io";
import { Button } from "../ui/button";

export const LogoutButton = () => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={async () => {
        await signOut();
      }}
    >
      <IoIosLogOut size={20} />
    </Button>
  );
};
