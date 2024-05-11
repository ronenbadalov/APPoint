"use client";

import moment, { Moment } from "moment";
import { useState } from "react";
import TooolbarCalendar from "./Header/ToolbarCalendar";
import CalendarBody from "./body/calendar-body";
import { AddEvent } from "./modals/add-event-modal";
import { CalendarViews } from "./types";

export default function WeeklyCalendar() {
  const [title, setTitle] = useState<String>(moment().format("MMMM YYYY"));

  const onChangeWeek = (weekMoment: Moment) => {
    const title = weekMoment.format("MMMM YYYY");
    setTitle(title);
  };
  return (
    <div className="py-5">
      <AddEvent />
      <TooolbarCalendar title={title} defaultView={CalendarViews.DAY} />
      <div className="mt-4">
        <CalendarBody changeWeek={onChangeWeek} />
      </div>
    </div>
  );
}