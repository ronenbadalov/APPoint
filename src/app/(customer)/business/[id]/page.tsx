"use client";
import { BusinessPage } from "@/components/BusinessPage";
import { AddAppointmentFormData } from "@/components/calendar/form/add-appointment-form";
import { EditAppointmentFormData } from "@/components/calendar/form/edit-appointment-form";
import { AddEventModal } from "@/components/calendar/modals/add-event-modal";
import { DetailsAppointmentModal } from "@/components/calendar/modals/details-appointment-modal";
import { EditAppointmentModal } from "@/components/calendar/modals/edit-appointment-modal";
import WeeklyCalendar from "@/components/calendar/weekly-calendar";
import { updateAppointment } from "@/mutations";
import { addAppointment } from "@/mutations/addAppointment";
import { getBusiness } from "@/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import moment, { Moment } from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const queryClient = useQueryClient();
  const [addAppointmentDate, setAddAppointmentDate] = useState(new Date());
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("details");
  const editSearch = searchParams.get("edit");

  const {
    data: businessData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["business-details", params.id],
    queryFn: () => getBusiness(params.id),
  });

  const { mutate: addEvent, isPending } = useMutation({
    mutationFn: addAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["business-details", params.id],
      });
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
    },
  });

  const { mutate: editAppointment, isPending: isEditPeding } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: async () => {
      const paramsEdit = new URLSearchParams(searchParams);
      paramsEdit.delete("edit");
      router.push(`${pathname}?${paramsEdit.toString()}`, { scroll: false });
      await queryClient.invalidateQueries({
        queryKey: ["business-details", params.id],
      });
      setIsOpenEditModal(false);
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
    },
  });

  const submitForm = (formData: AddAppointmentFormData) => {
    addEvent({
      bid: params.id,
      date: formData.startDate,
      serviceId: formData.service,
    });
  };

  const handleOnClickCell = (date: Moment, index: number) => {
    const isOnSameDayAndHour =
      moment().toDate().setMinutes(0, 0, 0) ===
      date.clone().toDate().setHours(index, 0, 0, 0);
    if (
      !isOnSameDayAndHour &&
      date.clone().set("hours", index).toDate() < new Date()
    ) {
      return;
    }

    if (isOnSameDayAndHour) {
      setAddAppointmentDate(new Date(moment().toDate()));
    } else {
      setAddAppointmentDate(
        date.clone().set("hours", index).seconds(0).millisecond(0).toDate()
      );
    }

    setIsOpen(true);
  };

  const { isDetailsModalOpen, event } = useMemo(() => {
    if (!businessData?.appointments || !search) {
      return {
        isDetailsModalOpen: false,
        event: null,
      };
    }

    const event = businessData?.appointments.find((app) => app.id === search);

    if (!event) {
      return {
        isDetailsModalOpen: false,
        event: null,
      };
    }

    return {
      isDetailsModalOpen: true,
      event,
    };
  }, [search, isLoading]);

  const { dateEdit, serviceEdit } = useMemo(() => {
    if (!editSearch) {
      setIsOpenEditModal(false);
      return {
        serviceEdit: null,
        dateEdit: new Date(),
      };
    }

    const event = businessData?.appointments.find(
      (app) => app.id === editSearch
    );

    if (!event) {
      setIsOpenEditModal(false);
      return {
        dateEdit: null,
        serviceEdit: null,
      };
    }

    setIsOpenEditModal(true);
    return {
      dateEdit: event.date,
      serviceEdit: event.service,
    };
  }, [editSearch]);

  const onDetailsModalChanged = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams);
      params.delete("details");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const onOpenAppointmentModal = (open: boolean) => {
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
      body: { date: formData.startDate },
    });
  };

  return (
    <>
      {isLoading ? (
        <div className=" flex justify-center items-center mt-64">
          <LoaderCircle className="animate-spin" size={32} />
        </div>
      ) : (
        <div>
          <EditAppointmentModal
            onSubmitEditForm={onSubmitEditForm}
            service={serviceEdit}
            dateValue={(dateEdit && new Date(dateEdit)) || new Date()}
            onOpen={onOpenAppointmentModal}
            isLoading={isEditPeding}
            isOpen={isOpenEditModal}
            workingHours={businessData?.workingHours}
          />
          <DetailsAppointmentModal
            service={event?.service || null}
            status={event?.status || null}
            isOpen={isDetailsModalOpen}
            onOpen={onDetailsModalChanged}
          />
          <AddEventModal
            isLoading={isPending || isFetching}
            onSubmitAddForm={submitForm}
            services={businessData?.services || null}
            dateValue={addAppointmentDate}
            onOpen={(open: boolean) => setIsOpen(open)}
            isOpen={isOpen}
            workingHours={businessData?.workingHours}
          />
          <BusinessPage businessData={businessData} isLoading={isLoading} />
          <WeeklyCalendar
            workingHours={businessData?.workingHours}
            events={businessData?.appointments}
            shouldScrollTo={false}
            onClickCell={handleOnClickCell}
          />
        </div>
      )}
    </>
  );
}
