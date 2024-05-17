import { paths } from "@/lib/paths";
import { getStatusLabel } from "@/lib/utils";
import { Appointment } from "@/queries";
import { format } from "date-fns";
import { CircleDollarSign, Clock, Dot } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center space-x-4">
        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
          {appointment.business.imageUrl && (
            <Link href={`${paths.BUSINESS}/${appointment.business.id}`}>
              <img
                className="aspect-square h-full w-full"
                src={appointment.business.imageUrl}
              />
            </Link>
          )}
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-1">
            <Link href={`${paths.BUSINESS}/${appointment.business.id}`}>
              <p className="text-sm font-medium leading-none hover:underline">
                {appointment.business.businessName}
              </p>
            </Link>
            <Dot className="h-4 w-4 text-muted-foreground" />

            <p className=" text-xs font-medium leading-none">
              {appointment.service.name}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex gap-1 items-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {format(new Date(appointment.date), "dd/MM/yyyy HH:mm")} -{" "}
                {format(
                  new Date(
                    new Date(appointment.date).getTime() +
                      appointment.service.duration * 60000
                  ),
                  "HH:mm"
                )}
              </p>
            </div>
            <Dot className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1 items-center">
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {appointment.service.price}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <p
          className={`text-sm font-medium ${
            appointment.status === "CANCELLED"
              ? "text-red-500"
              : appointment.status === "CONFIRMED"
              ? "text-green-500"
              : "text-accent-foreground"
          }`}
        >
          {getStatusLabel(appointment.status)}
        </p>
        <Link
          href={`https://www.google.com/maps?saddr=My+Location&daddr=${appointment.business.address}`}
          target="_blank"
          passHref
        >
          <img
            src="/static/google-maps.png"
            alt="google-maps"
            className="w-6 h-6 cursor-pointer"
          />
        </Link>
        <Link
          href={`https://www.waze.com/ul?ll=${appointment.business.latitude},${appointment.business.longitude}&navigate=yes`}
          passHref
          target="_blank"
        >
          <img
            src="/static/waze.svg"
            alt="waze"
            className="w-6 h-6 cursor-pointer"
          />
        </Link>
        {/* RONEN-TODO: make this work */}
        {appointment.status !== "CANCELLED" && (
          <Button variant="destructive">Cancel</Button>
        )}
      </div>
    </div>
  );
};
