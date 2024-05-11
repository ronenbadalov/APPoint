import { apiPaths } from "@/lib/api-paths";
import { User } from "@prisma/client";
import axios from "axios";
export const updateUser = async ({
  userId,
  partialUser,
}: {
  userId: string;
  partialUser: Partial<Omit<User, "id">>;
}) => {
  return axios.patch(`${apiPaths.USERS}/${userId}`, partialUser);
};
