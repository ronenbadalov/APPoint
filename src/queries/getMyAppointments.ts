import { apiPaths } from "@/lib/api-paths";
import axios from "axios";
export const getAppointments = async () => {
  return axios.get(apiPaths.APPOINTMENTS).then((res) => res.data);
};
