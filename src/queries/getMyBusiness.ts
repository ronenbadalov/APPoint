import { apiPaths } from "@/lib/api-paths";
import axios from "axios";
export const getMyBusiness = async () => {
  return axios.get(apiPaths.BUSINESS_DETAILS_MY_BUSINESS);
};
