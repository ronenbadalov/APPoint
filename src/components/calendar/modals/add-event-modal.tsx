import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import AddAppointmentForm from "../form/add-appointment-form";
import { Service } from "../types";

interface AddAppointmentModal {
  dateValue: Date;
  onOpen: Function;
  isOpen: boolean;
  services: Service[] | null;
  onSubmitAddForm: Function;
  isLoading: boolean
}

export function AddEventModal(props: AddAppointmentModal) {
  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => props.onOpen(open)}>
      <DialogContent>
        <AddAppointmentForm
          isLoading={props.isLoading}
          onSubmitAddForm={props.onSubmitAddForm}
          services={props.services}
          dateValue={props.dateValue}
        />
      </DialogContent>
    </Dialog>
  );
}
