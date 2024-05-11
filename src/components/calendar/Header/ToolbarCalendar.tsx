"use client";
import { CalendarViews } from "../types";

interface ToolbarCalendar {
  defaultView: CalendarViews;
  title: String;
}

export default function TooolbarCalendar({
  title,
}: ToolbarCalendar) {

  return (
    <div className="w-full flex justify-between">
      <div className="text-3xl font-bold">{title}</div>
    </div>
  );
}
