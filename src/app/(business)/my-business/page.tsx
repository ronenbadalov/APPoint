"use client";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getMyBusiness } from "@/queries/getMyBusiness";
import { BusinessDetails, Service, WorkingHours } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { LoaderCircle, Pencil } from "lucide-react";
type BusinessData =
  | (BusinessDetails & { workingHours: WorkingHours[]; services: Service[] })
  | undefined;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function MyBusinessPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["my-business"],
    queryFn: getMyBusiness,
  });
  console.log(response?.data);
  const businessData: BusinessData = response?.data;

  return isLoading ? (
    <div className=" flex justify-center items-center h-screen">
      <LoaderCircle className="animate-spin" size={32} />
    </div>
  ) : (
    <div className="py-5 flex flex-col max-w-screen-lg m-auto">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-5 items-center">
          <div className="rounded-full bg-gray-200 w-28 h-28 flex justify-center items-center">
            {/* <img src={businessData?.logo} alt="logo" /> */}
          </div>
          <h1 className="text-2xl font-bold">{businessData?.businessName}</h1>
        </div>
        <Button variant="secondary">
          <Pencil size={14} className="mr-2" />
          Edit
        </Button>
      </div>
      <Separator className="my-5" />
      <table className="flex flex-col gap-3">
        <tr className="flex gap-5">
          <td className="w-36">
            <p className="text-muted-foreground font-semibold">Description</p>
          </td>
          <td className=" w-full">
            {businessData?.description ? (
              <p className="">{businessData?.description}</p>
            ) : (
              <p className="text-muted-foreground italic">
                No description provided
              </p>
            )}
          </td>
        </tr>
        <tr className="flex gap-5">
          <td className="w-36">
            <p className="text-muted-foreground font-semibold">Address</p>
          </td>
          <td className=" w-full">
            {businessData?.address ? (
              <p className="">{businessData?.address}</p>
            ) : (
              <p className="text-muted-foreground italic">
                No address provided
              </p>
            )}
          </td>
        </tr>
        <tr className="flex gap-5">
          <td className="w-36">
            <p className="text-muted-foreground font-semibold">Phone</p>
          </td>
          <td className=" w-full">
            {businessData?.phone ? (
              <p className="">{businessData?.phone}</p>
            ) : (
              <p className="text-muted-foreground italic">No phone provided</p>
            )}
          </td>
        </tr>
        <tr className="flex gap-5">
          <td className="w-36">
            <p className="text-muted-foreground font-semibold whitespace-nowrap	">
              Working Hours
            </p>
          </td>
          <td className=" w-full">
            <table>
              {days.map((day, index) => {
                const workingHour = businessData?.workingHours.find(
                  (wh) => wh.day === index + 1
                );
                const isClosed = workingHour?.isClosed;
                const startTime = workingHour?.startTime
                  ? format(workingHour.startTime, "HH:mm")
                  : undefined;
                const endTime = workingHour?.endTime
                  ? format(workingHour.endTime, "HH:mm")
                  : undefined;
                return (
                  <tr key={index} className="flex items-center gap-2">
                    <td className="w-36">
                      <p className="text-muted-foreground">{day}</p>
                    </td>
                    <td className="w-36">
                      {isClosed ? (
                        <p className="text-muted-foreground italic">Closed</p>
                      ) : workingHour ? (
                        <p>
                          {startTime} - {endTime}
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Not provided
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </table>
          </td>
        </tr>
        <tr className="flex gap-5">
          <td className="w-36">
            <p className="text-muted-foreground font-semibold">Services</p>
          </td>
          <td className=" w-full">
            <div className="grid grid-cols-2 gap-5">
              {businessData?.services.length ? (
                businessData.services.map((service) => (
                  <ServiceCard key={service.id} {...service} />
                ))
              ) : (
                <p className="text-muted-foreground italic">
                  No services provided
                </p>
              )}
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
}
