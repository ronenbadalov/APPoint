"use client";

import { WorkingHours } from "@prisma/client";
import moment, { Moment } from "moment";
import { useState } from "react";
import TooolbarCalendar from "./Header/ToolbarCalendar";
import CalendarBody from "./body/calendar-body";
import { Appointment, CalendarViews } from "./types";

interface WeeklyCalendar {
  events?: Appointment[];
  shouldScrollTo: boolean;
  onClickCell?: Function;
  workingHours?: WorkingHours[]
}

export default function WeeklyCalendar({
  events,
  shouldScrollTo,
  onClickCell,
  workingHours
}: WeeklyCalendar) {
  const [title, setTitle] = useState<String>(moment().format("MMMM YYYY"));

  const onChangeWeek = (weekMoment: Moment) => {
    const title = weekMoment.format("MMMM YYYY");
    setTitle(title);
  };
  return (
    <div className="py-5">
      <TooolbarCalendar title={title} defaultView={CalendarViews.DAY} />
      <div className="mt-4">
        <CalendarBody
          workingHours={workingHours}
          changeWeek={onChangeWeek}
          events={events}
          shouldScrollTo={shouldScrollTo}
          onClickCell={onClickCell}
        />
      </div>
    </div>
  );
}
