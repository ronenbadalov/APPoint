import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Service } from "../types";
import FormItemDate from "./Items/FormItemDate";
import FormItemServiceSelect from "./Items/FormItemServiceSelect";

interface AppointmentForm {
  dateValue: Date;
  services: Service[] | null;
  onSubmitAddForm: Function;
  isLoading?: boolean;
}
const FormSchema = z.object({
  startDate: z
    .date()
    .refine((date) => date.getTime() >= new Date().getTime(), {
      message: "Please enter a valid date",
    }),

  service: z.string({ message: "Please enter a service" }),
});

export type AddAppointmentFormData = z.infer<typeof FormSchema>;

export default function AddAppointmentForm(props: AppointmentForm) {
  const form = useForm<AddAppointmentFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startDate: props.dateValue,
    },
  });

  const onSubmit = (data: AddAppointmentFormData) => {
    props.onSubmitAddForm(data);
  };

  const renderServiceDetails = (serviceId: string | null) => {
    const service = props.services?.find((s) => s.id === serviceId);
    if (!service) {
      return null;
    }

    return (
      <div className="flex flex-col gap-y-4 mt-4">
        <div className="flex items-center gap-x-3">
          <Label>Name: </Label>
          <p className="text-xs">{service.name}</p>
        </div>

        <div className="flex items-center gap-x-3">
          <Label>Description: </Label>
          <p className="text-xs">{service.description}</p>
        </div>

        <div className="flex items-center gap-x-3">
          <Label>Price: </Label>
          <p className="text-xs">{service.price}</p>
        </div>

        <div className="flex items-center gap-x-3">
          <Label>Duration: </Label>
          <p className="text-xs">{service.duration} Minutes</p>
        </div>
      </div>
    );
  };

  return (
    <Form {...form}>
      <FormItemDate
        value={props.dateValue}
        name="startDate"
        control={form.control}
        placeholder="Start Date"
      />

      <FormItemServiceSelect
        services={props.services || []}
        value=""
        name="service"
        control={form.control}
        placeholder="-- Select Service"
      />

      {renderServiceDetails(form.getValues("service"))}

      <Button
        disabled={props.isLoading}
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
      >
        {props.isLoading && <LoaderCircle className="animate-spin" size={16} />}
        Save changes
      </Button>
    </Form>
  );
}
