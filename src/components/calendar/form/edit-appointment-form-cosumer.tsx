import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentStatus, WorkingHours } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Service } from "../types";
import FormItemDate from "./Items/FormItemDate";

interface AppointmentForm {
  dateValue: Date;
  statusValue?: AppointmentStatus;
  service: Service | null;
  onSubmitEditForm: Function;
  isLoading?: boolean;
  workingHours?: WorkingHours[];
}
const FormSchema = z.object({
  startDate: z.date({ message: "Please enter valid date" }),
});

export type EditAppointmentFormData = z.infer<typeof FormSchema>;

export default function EditAppointmentFormConsumer(props: AppointmentForm) {
  const form = useForm<EditAppointmentFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startDate: props.dateValue,
    },
  });

  const onSubmit = (data: EditAppointmentFormData) => {
    props.onSubmitEditForm(data);
  };

  const statusLabel = useMemo(() => {
    if(AppointmentStatus.PENDING_BUSINESS === props.statusValue) {
      return 'Pending Approval'
    } 

    if(AppointmentStatus.CANCELLED === props.statusValue) {
      return 'Cancelled'
    }

    if(AppointmentStatus.CONFIRMED === props.statusValue) {
      return 'Confirmed'
    }

    if(AppointmentStatus.PENDING_CUSTOMER === props.statusValue) {
      return 'Pending for Consumer'
    }

    return null
  }, [props.statusValue])

  return (
    <Form {...form}>
      <FormItemDate
        value={props.dateValue}
        name="startDate"
        control={form.control}
        placeholder="Start Date"
      />

      {props.service ? (
        <div className="flex flex-col gap-y-4 mt-4">
          <div className="flex items-center gap-x-3">
            <Label>Name: </Label>
            <p className="text-xs">{props.service.name}</p>
          </div>

          <div className="flex items-center gap-x-3">
            <Label>Description: </Label>
            <p className="text-xs">{props.service.description}</p>
          </div>

          <div className="flex items-center gap-x-3">
            <Label>Price: </Label>
            <p className="text-xs">{props.service.price}</p>
          </div>

          <div className="flex items-center gap-x-3">
            <Label>Duration: </Label>
            <p className="text-xs">{props.service.duration}</p>
          </div>

          {statusLabel ? (
            <div className="flex items-center gap-x-3">
              <Label>Status: </Label>
              <p className="text-xs">{statusLabel}</p>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      <Button
        disabled={props.isLoading}
        type="submit"
        onClick={() => form.handleSubmit(onSubmit)()}
      >
        {props.isLoading && <LoaderCircle className="animate-spin" size={16} />}
        Save changes
      </Button>
    </Form>
  );
}
