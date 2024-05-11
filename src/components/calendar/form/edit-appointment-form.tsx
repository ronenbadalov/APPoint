import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentStatus } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Service } from "../types";
import FormItemDate from "./Items/FormItemDate";
import FormItemStatus from "./Items/FormItemStatus";

interface AppointmentForm {
  dateValue: Date;
  statusValue: AppointmentStatus;
  service: Service | null;
  onSubmitEditForm: Function;
}
const FormSchema = z.object({
  startDate: z.date({ message: "Please enter valid date" }),
  status: z.nativeEnum(AppointmentStatus),
});

export type EditAppointmentFormData = z.infer<typeof FormSchema>;

export default function EditAppointmentForm(props: AppointmentForm) {
  const form = useForm<EditAppointmentFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startDate: props.dateValue,
      status: props.statusValue,
    },
  });

  const onSubmit = (data: EditAppointmentFormData) => {
    props.onSubmitEditForm(data);
  };

  return (
    <Form {...form}>
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

          <div className="flex items-center gap-x-3">
            <Label>Status: </Label>
            <p className="text-xs">{props.statusValue}</p>
          </div>
        </div>
      ) : (
        ""
      )}

      <FormItemDate
        value={props.dateValue}
        name="startDate"
        control={form.control}
        placeholder="Start Date"
      />

      <FormItemStatus
        value={props.statusValue}
        name="status"
        control={form.control}
        placeholder="Change Status"
      />

      <Button type="submit" onClick={() => form.handleSubmit(onSubmit)()}>
        Save changes
      </Button>
    </Form>
  );
}
