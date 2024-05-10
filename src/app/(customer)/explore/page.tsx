"use client";
import { Card } from "@/components/ui/card";
import { Business, getBusinesses } from "@/queries";
import { useQuery } from "@tanstack/react-query";

interface BusinessDetails {}

export default function ExplorePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["busines-details"],
    queryFn: getBusinesses,
  });
  console.log(data);
  // grid of cards
  return (
    <div className="mx-auto py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? "Loading..."
          : data?.map((business: Business) => (
              <Card
                key={business.id}
                // animate image on hover
                className="relative overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105"
              >
                {business.imageUrl && (
                  <img
                    src={business.imageUrl}
                    alt={business.businessName}
                    width="100%"
                    height="100%"
                    className="object-cover rounded-t-xl"
                  />
                )}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-semibold tracking-tight">
                      {business.businessName}
                    </h1>
                    <p className="text-sm text-gray-500">{business.address}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {business.description}
                  </p>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
