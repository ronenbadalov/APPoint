import { apiPaths } from "@/lib/api-paths";
import axios from "axios";
import { BusinessData } from "./getMyBusiness";

export const getBusiness = async (bid: string): Promise<BusinessData> => {
  return axios({
    baseURL: "/",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    url: `${apiPaths.BUSINESSES_DETAILS}/${bid}`,
  }).then((res) => res.data);
};
