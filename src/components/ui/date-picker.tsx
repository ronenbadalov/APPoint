import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useRef, useState } from "react";
import { TimePickerInput } from "../TimePickerInput";
import { Button } from "./button";
import { Label } from "./label";

interface DatePickerType {
  onDateChange: Function;
  value: Date;
}

export function DatePicker(props: DatePickerType) {
  const [date, setDate] = useState<Date>(props.value);
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/LL/yyyy HH:mm:ss") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            date && setDate(date);
            props.onDateChange(date);
          }}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <div className="flex items-end gap-2">
            <div className="grid gap-1 text-center">
              <Label htmlFor="hours" className="text-xs">
                Hours
              </Label>
              <TimePickerInput
                picker="hours"
                date={date}
                setDate={(date) => {
                  date && setDate(date);
                  props.onDateChange(date);
                }}
                ref={hourRef}
                onRightFocus={() => minuteRef.current?.focus()}
              />
            </div>
            <div className="grid gap-1 text-center">
              <Label htmlFor="minutes" className="text-xs">
                Minutes
              </Label>
              <TimePickerInput
                picker="minutes"
                date={date}
                setDate={(date) => {
                  date && setDate(date);
                  props.onDateChange(date);
                }}
                ref={minuteRef}
                onLeftFocus={() => hourRef.current?.focus()}
                onRightFocus={() => secondRef.current?.focus()}
              />
            </div>
            <div className="grid gap-1 text-center">
              <Label htmlFor="seconds" className="text-xs">
                Seconds
              </Label>
              <TimePickerInput
                picker="seconds"
                date={date}
                setDate={(date) => {
                  date && setDate(date);
                  props.onDateChange(date);
                }}
                ref={secondRef}
                onLeftFocus={() => minuteRef.current?.focus()}
              />
            </div>
            <div className="flex h-10 items-center">
              <Clock className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
