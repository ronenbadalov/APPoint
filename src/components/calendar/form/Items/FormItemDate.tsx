import { DatePicker } from "@/components/ui/date-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormItemCalendar } from "../../types";

interface DateField extends FormItemCalendar {
  value: Date;
}

export default function FormItemDate(props: DateField) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <DatePicker value={props.value} onDateChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    ></FormField>
  );
}
