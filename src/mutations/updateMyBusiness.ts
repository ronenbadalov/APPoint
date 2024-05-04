import { apiPaths } from "@/lib/api-paths";
import { BusinessDetails } from "@prisma/client";
import axios from "axios";
export const updateMyBusiness = async (
  partialBusinessDetails: Omit<
    BusinessDetails,
    "id" | "user" | "userId" | "appointments"
  >
) => {
  return axios.patch(
    `${apiPaths.BUSINESS_DETAILS_MY_BUSINESS}`,
    partialBusinessDetails
  );
};
