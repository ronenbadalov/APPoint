import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AppointmentStatus } from "@prisma/client";
import { FormItemCalendar } from "../../types";

interface StatusField extends FormItemCalendar {
  value: AppointmentStatus;
}

export default function FormItemStatus(props: StatusField) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Select defaultValue={props.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={AppointmentStatus.CONFIRMED}>
                    Confirm
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.CANCELLED}>
                    Cancel
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    ></FormField>
  );
}
