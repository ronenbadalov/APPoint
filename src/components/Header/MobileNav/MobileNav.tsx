"use client";
import { Drawer } from "@/components/Drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Button variant="ghost" onClick={toggleDrawer}>
        <Menu className="w-6 h-6" />
      </Button>
      <Drawer isOpen={isOpen} onClose={toggleDrawer} />
    </>
  );
};
