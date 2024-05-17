import { apiPaths } from "@/lib/api-paths";
import {
  BusinessDetails,
  Appointment as DBAppointment,
  Service,
} from "@prisma/client";
import axios from "axios";

export type Appointment = DBAppointment & {
  service: Service;
  business: BusinessDetails;
  date: string;
};
export const getAppointments = async (): Promise<Appointment[]> => {
  return axios.get(apiPaths.APPOINTMENTS).then((res) => res.data);
};
