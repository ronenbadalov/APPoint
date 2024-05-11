import { apiPaths } from "@/lib/api-paths";
import { BusinessDetails } from "@prisma/client";
import axios from "axios";
export interface Business extends Omit<BusinessDetails, "userId"> {}

export const getBusinesses = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<Business[]> => {
  return axios
    .get(`${apiPaths.BUSINESSES_DETAILS}?page=${pageParam}`)
    .then((res) => res.data);
};
