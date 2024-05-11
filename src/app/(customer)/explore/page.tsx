"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BUSINESSES_PER_PAGE } from "@/lib/explore";
import { paths } from "@/lib/paths";
import { Business, getBusinesses } from "@/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { LoaderCircle, MapPin, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function ExplorePage() {
  const observer = useRef<IntersectionObserver>();
  const [query, setQuery] = useState<string>("");
  const [position, setPosition] = useState<[number, number]>();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["busines-details", query, position],
      queryFn: ({ pageParam }) =>
        getBusinesses({
          pageParam,
          queryParam: query,
          latitude: position?.[0],
          longitude: position?.[1],
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === BUSINESSES_PER_PAGE
          ? allPages.length
          : undefined;
      },
    });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((position) => {
      setPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

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

  const debouncedSetQuery = useCallback(
    debounce(async (q: string) => {
      setQuery(q.trim());
    }, 300),
    []
  );

  return (
    <div className="mx-auto py-4 space-y-7">
      <div className="flex justify-center  px-4">
        <div className="relative w-full max-w-lg">
          <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
            <SearchIcon size={18} className="text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search by business name, service or address..."
            className={
              "flex disabled:cursor-not-allowed disabled:opacity-50 pl-8"
            }
            onChange={(e) => debouncedSetQuery(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className=" flex justify-center items-center mt-64">
          <LoaderCircle className="animate-spin" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:lg:grid-cols-4 px-4">
            {businesses.map((business: Business) => (
              <Link key={business.id} href={`${paths.BUSINESS}/${business.id}`}>
                <Card
                  ref={lastElementRef}
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
                        <div className="flex gap-3">
                          <p className="text-sm">{business.address}</p>
                          {business.distance && (
                            <p className="text-sm text-muted-foreground">
                              {business.distance.toFixed(2)} km away
                            </p>
                          )}
                        </div>
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
        </>
      )}
      {!isLoading && isFetching && (
        <div className=" flex justify-center items-center mt-7">
          <LoaderCircle className="animate-spin" size={32} />
        </div>
      )}
      {!isLoading && businesses.length === 0 && (
        <div className="flex justify-center items-center mt-64">
          <p className="text-muted-foreground">No businesses found</p>
        </div>
      )}
    </div>
  );
}
