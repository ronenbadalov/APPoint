"client only";

import moment from "moment";
import { useEffect, useRef } from "react";
import { Appointment, DayEvent } from "../types";
import { calcEventDimesionsAndTop } from "../utils/calendar";
import EventCalendar from "./event";

interface ColumnUI extends DayEvent {
  isLast?: Boolean;
  rowHeight?: number;
}

const EVENT_PADDING_Y = 2; //px

export default function CalendarColumn({
  date,
  title,
  subtitle,
  events,
  isLast = false,
  rowHeight = 150,
}: ColumnUI) {
  const redLineRef = useRef<HTMLDivElement>(null);
  const paintHours = [];
  const inlineStyles = {
    height: `${rowHeight}px`,
    borderRight: isLast ? "1px solid #f4f3fb" : "",
    borderTop: "1px solid #f4f3fb",
    borderLeft: "1px solid #f4f3fb",
  };

  useEffect(() => {
    if (!redLineRef.current) return;

    redLineRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const now = moment()
    .set("hours", 0)
    .set("minutes", 0)
    .set("seconds", 0)
    .set("milliseconds", 0);
  const isToday =
    now.toDate().toString() ===
    date
      .clone()
      .set("hours", 0)
      .set("minutes", 0)
      .set("seconds", 0)
      .set("milliseconds", 0)
      .toDate()
      .toString();

  const hour = isToday ? moment().get("hour") : null;
  const minutes = isToday ? moment().get("minutes") : null;

  let redLine = null;
  if (hour !== null && minutes !== null) {
    redLine = (
      <div
        id="red-line"
        className="absolute w-full flex items-center"
        ref={redLineRef}
        style={{
          top: `${hour * rowHeight + rowHeight * (minutes / 60) - 6}px`,
          width: `calc(100% + 6px)`,
        }}
      >
        <div className="border-t-[2px] border-t-red-600 w-full" />
        <div className="h-3 w-3 bg-red-600 rounded-full" />
      </div>
    );
  }

  for (let i = 0; i < 24; i++) {
    paintHours.push(
      <div
        style={inlineStyles}
        className={
          "bg-white dark:bg-[#0A0A0A]" +
          (i === 23 ? "border-b-[1px] dark:bg-[#0A0A0A] border-[#f4f3fb]" : "")
        }
        key={"hour_" + Math.random()}
      ></div>
    );
  }
  const printEvents = () => {
    if (!events?.length) {
      return;
    }

    const eventToPrint = [];
    const filterAppointments: Appointment[] = events.filter(
      (event) =>
        Number(date.toDate().setHours(0, 0, 0, 0)) ===
        new Date(event.date).setHours(0, 0, 0, 0)
    );

    const appointments = calcEventDimesionsAndTop(
      rowHeight,
      filterAppointments
    );
    for (const event of appointments) {
      eventToPrint.push(
        <div>
          <EventCalendar
            id={event.id}
            date={event.date}
            status={event.status}
            service={event.service}
            height={event.height - EVENT_PADDING_Y * 2}
            width={event.width}
            top={event.top + EVENT_PADDING_Y}
            left={event.left}
          />
        </div>
      );
    }

    return eventToPrint;
  };

  return (
    <div>
      <div id="column-hours-container">
        <div className="flex flex-col items-center justify-center py-3 px-2 gap-y-1 bg-[#fafafb] dark:bg-[#0A0A0A] border-[#f4f3fb] border-t-[1px] border-l-[1px] border-r-[1px]">
          <div className="text-3xl font-bold">{title + ""}</div>
          <div className="text-[#7c789a]">{subtitle + ""}</div>
        </div>
        <div>
          <div className="relative">{printEvents()}</div>
        </div>
        <div className="flex flex-col bg-red-50">
          <div className="relative">{redLine}</div>
          {paintHours}
        </div>
      </div>
    </div>
  );
}
