"use client";
import { BusinessPage } from "@/components/BusinessPage";
import { getBusiness } from "@/queries";
import { useQuery } from "@tanstack/react-query";

export default function Page({ params }: { params: { id: string } }) {
  const { data: businessData, isLoading } = useQuery({
    queryKey: ["business-details", params.id],
    queryFn: () => getBusiness(params.id),
  });
  return <BusinessPage businessData={businessData} isLoading={isLoading} />;
}
