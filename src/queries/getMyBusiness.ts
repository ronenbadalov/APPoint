import { Appointment } from "@/components/calendar/types";
import { apiPaths } from "@/lib/api-paths";
import { BusinessDetails, Service, WorkingHours } from "@prisma/client";
import axios from "axios";
export type BusinessData =
  | (BusinessDetails & { workingHours: WorkingHours[]; services: Service[]; appointments: Appointment[]})
  | undefined;

export const getMyBusiness = async (): Promise<BusinessData> => {
  return axios
    .get(apiPaths.BUSINESS_DETAILS_MY_BUSINESS)
    .then((res) => res.data);
};
