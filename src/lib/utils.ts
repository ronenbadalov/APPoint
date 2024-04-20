import { clsx, type ClassValue } from "clsx";
import jwt from "jsonwebtoken";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const verifySelectRoleToken = (token: string) => {
  try {
    return jwt.verify(token, "random_key");
  } catch (e) {
    return null;
  }
};
