"use client";

import { ModeToggle } from "@/components/Header/ModeToggle";
import { EditAppointmentFormData } from "@/components/calendar/form/edit-appointment-form";
import { EditAppointmentModal } from "@/components/calendar/modals/edit-appointment-modal";
import { Appointment, Service } from "@/components/calendar/types";
import WeeklyCalendar from "@/components/calendar/weekly-calendar";
import { updateAppointment } from "@/mutations/updateAppointment";
import { getAppointments } from "@/queries";
import { AppointmentStatus } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function CalendarPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });
  const queryClient = useQueryClient();

  const { mutate: editAppointment } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      const params = new URLSearchParams(searchParams);
      params.delete("edit");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const searchParams = useSearchParams();
  const search = searchParams.get("edit");
  const { isOpen, date, status, service } = useMemo(() => {
    const values: {
      isOpen: boolean;
      status: AppointmentStatus;
      date: Date;
      service: Service | null;
    } = {
      isOpen: false,
      date: new Date(),
      status: AppointmentStatus.CONFIRMED,
      service: null,
    };

    if (!search || !data) {
      return values;
    }

    const appointment: Appointment | null = data.find(
      (appointment: Appointment) => appointment.id === search
    );
    if (!appointment) {
      return values;
    }

    values.date = new Date(appointment.date);
    values.status = appointment.status;
    values.service = appointment.service;
    values.isOpen = true;
    return values;
  }, [search, isLoading]);

  const onOpen = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams);
      params.delete("edit");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const onSubmitEditForm = (formData: EditAppointmentFormData) => {
    const params = new URLSearchParams(searchParams);

    const id = params.get("edit");
    if (!id) {
      return;
    }

    editAppointment({
      id,
      body: { status: formData.status, date: formData.startDate },
    });
  };

  return (
    <section>
      <EditAppointmentModal
        onSubmitEditForm={onSubmitEditForm}
        service={service}
        dateValue={date}
        status={status}
        onOpen={onOpen}
        isOpen={isOpen}
      />
      <ModeToggle />
      <WeeklyCalendar />
    </section>
  );
}
