"use client";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import { useTheme } from "next-themes";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

export const Logo = (props: Omit<ImageProps, "src" | "alt">) => {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div style={{ width: props.width, height: props.height }}></div>;
  }
  return (
    <Image
      src={resolvedTheme === "light" ? logoLight : logoDark}
      alt="APPoint Logo"
      {...props}
    />
  );
};
