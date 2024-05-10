import { apiPaths } from "@/lib/api-paths";
import { BusinessDetails, Service, WorkingHours } from "@prisma/client";
import axios from "axios";
type BusinessData =
  | (BusinessDetails & { workingHours: WorkingHours[]; services: Service[] })
  | undefined;

export const getMyBusiness = async (): Promise<BusinessData> => {
  return axios
    .get(apiPaths.BUSINESS_DETAILS_MY_BUSINESS)
    .then((res) => res.data);
};
