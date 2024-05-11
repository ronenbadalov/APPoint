"use client";

import { BusinessPage } from "@/components/BusinessPage";
import { getMyBusiness } from "@/queries";
import { useQuery } from "@tanstack/react-query";

export default function MyBusinessPage() {
  const {
    data: businessData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-business"],
    queryFn: getMyBusiness,
  });

  return (
    <BusinessPage
      businessData={businessData}
      isLoading={isLoading}
      refetch={refetch}
    />
  );
}
