"use client";
import { AppointmentCard } from "@/components/AppointmentCard";
import { getAppointments } from "@/queries";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useMemo } from "react";

export default function MyProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });
  const upcomingAppointments = useMemo(
    () =>
      data?.filter((appointment) => new Date(appointment.date) >= new Date()),
    [data]
  );
  const pastAppointments = useMemo(
    () =>
      data?.filter((appointment) => new Date(appointment.date) < new Date()),
    [data]
  );

  if (isLoading)
    return (
      <div className=" flex justify-center items-center mt-64">
        <LoaderCircle className="animate-spin" size={32} />
      </div>
    );

  return (
    <div className="py-5 flex flex-col max-w-screen-lg m-auto gap-5">
      <h1 className="text-3xl font-bold text-accent-foreground mb-4">
        My Appointments
      </h1>
      <h2 className="text-xl font-bold">Upcoming Appointments</h2>

      {upcomingAppointments?.length ? (
        upcomingAppointments.map((appointment) => (
          <AppointmentCard appointment={appointment} />
        ))
      ) : (
        <p className="text-muted-foreground">No upcoming appointments</p>
      )}
      <h2 className="text-xl font-bold">Past Appointments</h2>
      {pastAppointments?.length ? (
        pastAppointments.map((appointment) => (
          <AppointmentCard appointment={appointment} />
        ))
      ) : (
        <p className="text-muted-foreground">No past appointments</p>
      )}
    </div>
  );
}
