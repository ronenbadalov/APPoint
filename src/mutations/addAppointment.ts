import { apiPaths } from "@/lib/api-paths";
import axios from "axios";

type AddAppointment = {
  bid: string,
  date: Date,
  serviceId: string
}
export const addAppointment = async ({bid, date, serviceId}: AddAppointment) => {
  return axios.post(apiPaths.APPOINTMENTS + `/${bid}`, {date, serviceId}).then((res) => res.data);
};
