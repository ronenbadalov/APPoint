"use client";

import moment, { Moment } from "moment";
import { useState } from "react";
import TooolbarCalendar from "./Header/ToolbarCalendar";
import CalendarBody from "./body/calendar-body";
import { Appointment, CalendarViews } from "./types";

interface WeeklyCalendar {
  events?: Appointment[];
  shouldScrollTo: boolean;
  onClickCell?: Function;
}

export default function WeeklyCalendar({
  events,
  shouldScrollTo,
  onClickCell,
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
          changeWeek={onChangeWeek}
          events={events}
          shouldScrollTo={shouldScrollTo}
          onClickCell={onClickCell}
        />
      </div>
    </div>
  );
}
