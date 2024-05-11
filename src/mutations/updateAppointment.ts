import { apiPaths } from "@/lib/api-paths";
import { Appointment } from "@prisma/client";
import axios from "axios";
export const updateAppointment = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<Pick<Appointment, "date" | "serviceId" | "status">>;
}) => {
  return axios.patch(`${apiPaths.APPOINTMENTS}/${id}`, body);
};
