import { apiPaths } from "@/lib/api-paths";
import { BusinessDetails } from "@prisma/client";
import axios from "axios";
export interface Business extends Omit<BusinessDetails, "userId"> {}

export const getBusinesses = async (): Promise<Business[]> => {
  return axios.get(apiPaths.BUSINESSES_DETAILS).then((res) => res.data);
};
