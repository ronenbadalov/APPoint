import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AppointmentStatus } from "@prisma/client";
import { Service } from "../types";

interface DetailsAppointmentModal {
  onOpen: Function;
  isOpen: boolean;
  status: AppointmentStatus | null;
  service: Service | null;
}

export function DetailsAppointmentModal(props: DetailsAppointmentModal) {
  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => props.onOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-4 mt-4">
          <div className="flex items-center gap-x-3">
            <Label>Name: </Label>
            <p className="text-xs">{props.service?.name}</p>
          </div>

          <div className="flex items-center gap-x-3">
            <Label>Description: </Label>
            <p className="text-xs">{props.service?.description}</p>
          </div>

          <div className="flex items-center gap-x-3">
            <Label>Price: </Label>
            <p className="text-xs">{props.service?.price}</p>
          </div>

          <div className="flex items-center gap-x-3">
            <Label>Duration: </Label>
            <p className="text-xs">{props.service?.duration} Minutes</p>
          </div>

          <div className="flex items-center gap-x-3">
            <Label>Status: </Label>
            <p className="text-xs">{props.status}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
