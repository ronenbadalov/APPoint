import { AppointmentStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusLabel = (status: AppointmentStatus) => {
  switch (status) {
    case "PENDING_BUSINESS":
    case "PENDING_CUSTOMER":
      return "Pending";
    case "CONFIRMED":
      return "Confirmed";
    case "CANCELLED":
      return "Cancelled";
  }
};
