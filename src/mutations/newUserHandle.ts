import { apiPaths } from "@/lib/api-paths";
import { Role } from "@prisma/client";
import axios from "axios";

export const newUserHandle = async ({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) => {
  return axios.post(`${apiPaths.USERS_NEW_USER}`, { userId, role });
};
