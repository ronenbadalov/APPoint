import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkingHours } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import moment from "moment";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Service } from "../types";
import { isInWorkingHours } from "../utils/calendar";
import FormItemDate from "./Items/FormItemDate";
import FormItemServiceSelect from "./Items/FormItemServiceSelect";

interface AppointmentForm {
  dateValue: Date;
  services: Service[] | null;
  onSubmitAddForm: Function;
  isLoading?: boolean;
  workingHours?: WorkingHours[];
}
const FormSchema = z.object({
  startDate: z.date().refine((date) => date.getTime() >= new Date().getTime(), {
    message: "Please enter a valid date",
  }),

  service: z.string({ message: "Please enter a service" }),
});

export type AddAppointmentFormData = z.infer<typeof FormSchema>;

export default function AddAppointmentForm(props: AppointmentForm) {
  const form = useForm<AddAppointmentFormData>({
    resolver: zodResolver(FormSchema),
  });
  const defaultMinutes = useMemo(() => {
    let minutes = new Date().getMinutes();
    if (minutes > 0 && minutes < 15) {
      minutes = 15;
    } else if (minutes >= 15 && minutes < 30) {
      minutes = 30;
    } else if (minutes >= 30 && minutes < 45) {
      minutes = 45;
    } else if (minutes >= 45) {
      minutes = 50;
    }

    form.setValue(
      "startDate",
      new Date(new Date(props.dateValue).setMinutes(minutes))
    );

    return minutes;
  }, [props.dateValue]);

  const onSubmit = (data: AddAppointmentFormData) => {
    props.onSubmitAddForm(data);
  };

  const hourValidation = (): boolean => {
    const startDate = new Date(form.watch("startDate").getTime());
    const selectedService = props.services?.find(
      (service) => service.id === form.watch("service")
    );

    if (!selectedService) {
      form.setError("startDate", {
        message: "Please select service first",
      });
      return false
    }

    const day = startDate.getDay();
    const isAllowed = isInWorkingHours(
      props.workingHours?.[day] || null,
      moment(new Date(startDate.setHours(0, 0, 0, 0))).clone(),
      new Date(form.watch("startDate")).getHours() + new Date(form.watch("startDate")).getMinutes() / 60,
      selectedService.duration / 60
    );

    if (!isAllowed) {
      form.setError("startDate", {
        message: "The hour is not match to opening hours of the bussiness",
      });
    }

    return isAllowed;
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
      
      <FormItemServiceSelect
        services={props.services || []}
        value=""
        name="service"
        control={form.control}
        placeholder="-- Select Service"
      />
      
      <FormItemDate
        value={new Date(new Date(props.dateValue).setMinutes(defaultMinutes))}
        name="startDate"
        control={form.control}
        placeholder="Start Date"
        workingHours={props.workingHours}
      />

      {renderServiceDetails(form.getValues("service"))}

      <Button
        disabled={props.isLoading}
        type="submit"
        onClick={(e) => {
          const isValid = hourValidation();
          if (isValid) {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }
        }}
      >
        {props.isLoading && <LoaderCircle className="animate-spin" size={16} />}
        Save changes
      </Button>
    </Form>
  );
}
