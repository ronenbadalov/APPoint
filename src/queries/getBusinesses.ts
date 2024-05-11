import { apiPaths } from "@/lib/api-paths";
import { BusinessDetails } from "@prisma/client";
import axios from "axios";
export interface Business extends Omit<BusinessDetails, "userId"> {
  distance: number;
}

export const getBusinesses = async ({
  pageParam,
  queryParam,
  latitude,
  longitude,
}: {
  pageParam: number;
  queryParam?: string;
  latitude?: number;
  longitude?: number;
}): Promise<Business[]> => {
  return axios
    .get(`${apiPaths.BUSINESSES_DETAILS}`, {
      params: { page: pageParam, query: queryParam, latitude, longitude },
    })
    .then((res) => res.data);
};
