"use client";
import { Card } from "@/components/ui/card";
import { BUSINESSES_PER_PAGE } from "@/lib/explore";
import { paths } from "@/lib/paths";
import { Business, getBusinesses } from "@/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";

// RONEN-TOOD: add search bar - search by name/address
// RONEN-TOOD: add google maps integration in business page + link to google maps & waze
export default function ExplorePage() {
  const observer = useRef<IntersectionObserver>();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["busines-details"],
      queryFn: ({ pageParam }) => getBusinesses({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === BUSINESSES_PER_PAGE
          ? allPages.length
          : undefined;
      },
    });

  const businesses = useMemo(() => {
    return (
      data?.pages.reduce((acc, page) => {
        return [...acc, ...page];
      }, []) || []
    );
  }, [data]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );

  return (
    <div className="mx-auto py-4">
      {isLoading ? (
        <div className=" flex justify-center items-center mt-64">
          <LoaderCircle className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {businesses.map((business: Business) => (
            <Link href={`${paths.BUSINESS}/${business.id}`}>
              <Card
                ref={lastElementRef}
                key={business.id}
                className="relative overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer h-full"
              >
                {business.imageUrl && (
                  <img
                    src={business.imageUrl}
                    alt={business.businessName}
                    width="100%"
                    height="100%"
                    className="object-cover rounded-t-xl h-48 w-full aspect-ratio[16/9]"
                  />
                )}
                <div className="p-4 flex flex-col gap-2">
                  <h1 className="text-xl font-semibold tracking-tight">
                    {business.businessName}
                  </h1>
                  <div className="flex gap-2 items-center">
                    <MapPin size={16} />
                    {business.address ? (
                      <p className="text-sm">{business.address}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No address provided
                      </p>
                    )}
                  </div>
                  {business.description ? (
                    <p className="line-clamp-3 text-xs text-muted-foreground">
                      {business.description}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No description provided
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {!isLoading && isFetching && (
        <div className=" flex justify-center items-center mt-7">
          <LoaderCircle className="animate-spin" size={32} />
        </div>
      )}
    </div>
  );
}
