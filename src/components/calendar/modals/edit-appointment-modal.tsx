import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentStatus, Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import EditAppointmentForm from "../form/edit-appointment-form";
import EditAppointmentFormConsumer from "../form/edit-appointment-form-cosumer";
import { Service } from "../types";

interface EditAppointmentModal {
  dateValue: Date;
  status?: AppointmentStatus;
  onOpen: Function;
  isOpen: boolean;
  service: Service | null;
  onSubmitEditForm: Function;
  isLoading?: boolean;
}

export function EditAppointmentModal(props: EditAppointmentModal) {
  const { data: session } = useSession();

  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => props.onOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        {session?.user.role === Role.BUSINESS ? (
          <EditAppointmentForm
            isLoading={props.isLoading}
            onSubmitEditForm={props.onSubmitEditForm}
            service={props.service}
            dateValue={props.dateValue}
            statusValue={props.status}
          />
        ) : (
          <EditAppointmentFormConsumer
            isLoading={props.isLoading}
            onSubmitEditForm={props.onSubmitEditForm}
            service={props.service}
            dateValue={props.dateValue}
            statusValue={props.status}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
