import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentStatus } from "@prisma/client";
import EditAppointmentForm from "../form/edit-appointment-form";
import { Service } from "../types";

interface EditAppointmentModal {
  dateValue: Date;
  status: AppointmentStatus;
  onOpen: Function;
  isOpen: boolean;
  service: Service | null;
  onSubmitEditForm: Function;
}

export function EditAppointmentModal(props: EditAppointmentModal) {
  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => props.onOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        <EditAppointmentForm
          onSubmitEditForm={props.onSubmitEditForm}
          service={props.service}
          dateValue={props.dateValue}
          statusValue={props.status}
        />
      </DialogContent>
    </Dialog>
  );
}
