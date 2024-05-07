import { apiPaths } from "@/lib/api-paths";
import { BusinessDetails } from "@prisma/client";
import axios from "axios";
export const updateMyBusiness = async (
  partialBusinessDetails: Partial<
    Omit<BusinessDetails, "id" | "user" | "userId" | "appointments">
  >
) => {
  let imageUrlRes = null;
  if (partialBusinessDetails.imageUrl) {
    const formData = new FormData();
    formData.append("image", (partialBusinessDetails as any).imageUrl as Blob);
    imageUrlRes = await axios.post(
      `${apiPaths.BUSINESS_DETAILS_MY_BUSINESS_FILE_UPLOAD}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  }

  partialBusinessDetails.imageUrl = imageUrlRes?.data;

  return axios.patch(
    `${apiPaths.BUSINESS_DETAILS_MY_BUSINESS}`,
    partialBusinessDetails
  );
};
