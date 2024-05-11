import { Role } from "@prisma/client";

export const paths = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  SELECT_ROLE: "/select-role",
  MY_BUSINESS: "/my-business",
  CALENDAR: "/calendar",
  EXPLORE: "/explore",
  MY_PROFILE: "/my-profile",
  BUSINESS: "/business",
};

export const defaultPaths = {
  [Role.BUSINESS]: paths.MY_BUSINESS,
  [Role.CUSTOMER]: paths.EXPLORE,
};
