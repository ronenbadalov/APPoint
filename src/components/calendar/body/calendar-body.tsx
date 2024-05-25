"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment, { Moment } from "moment";
import { useEffect, useMemo, useState } from "react";
import { Appointment } from "../types";
import { getDays, getDaysOfWeekByDay } from "../utils/date";
import CalendarColumn from "./calendar-column";

interface CalendarBody {
  changeWeek: Function;
  events?: Appointment[];
  shouldScrollTo: boolean;
  onClickCell?: Function;
}

enum ResponsiveModes {
  SM = "SM",
  LG = "LG",
  XL = "XL",
}

const HOUR_TEXT_LINE_HEIGHT = 16; //px
const CELL_HEIGHT = 150; //px

export default function CalendarBody({
  changeWeek,
  events,
  shouldScrollTo,
  onClickCell,
}: CalendarBody) {
  const [currentDay, setCurrectDay] = useState<Moment>(moment().weekday(0));
  const [daysOfWeek, setDaysOfWeek] = useState<Moment[]>([]);
  const [responsiveMode, setResponsiveMode] = useState<ResponsiveModes>(
    ResponsiveModes.LG
  );

  const hours = [];

  const numberOfColumns = useMemo(() => {
    switch (responsiveMode) {
      case "SM":
        return 1;
      case "LG":
        return 3;
    }

    return 7;
  }, [responsiveMode]);

  useEffect(() => {
    const currectWeek = getDaysOfWeekByDay(moment().startOf("day"));
    setDaysOfWeek(currectWeek);
    const handleResize = function () {
      if (window.innerWidth < 1024) {
        setResponsiveMode(ResponsiveModes.SM);
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1440) {
        setResponsiveMode(ResponsiveModes.LG);
      } else {
        setResponsiveMode(ResponsiveModes.XL);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  for (let i = 0; i < 24; i++) {
    if (i === 0) {
      continue;
    }

    let marginTop = CELL_HEIGHT - HOUR_TEXT_LINE_HEIGHT;
    if (i === 1) {
      marginTop = CELL_HEIGHT - HOUR_TEXT_LINE_HEIGHT / 2;
    }

    const hourText = String(i).padStart(2, "0") + ":00";
    hours.push(
      <div
        className="text-xs text-[#64627D] font-bold tracking-wide"
        style={{ marginTop }}
        key={"hour_" + i}
      >
        {hourText}
      </div>
    );
  }

  const incDay = async () => {
    const nextDay = moment(currentDay).add(numberOfColumns, "day");
    const daysOfNextWeek = getDays(nextDay, 7);
    setCurrectDay(nextDay);
    setDaysOfWeek(daysOfNextWeek);
    changeWeek(nextDay);
  };

  const decDay = async () => {
    const nextDay = moment(currentDay).add(-numberOfColumns, "day");
    const daysOfNextWeek = getDays(nextDay, 7);
    setCurrectDay(nextDay);
    setDaysOfWeek(daysOfNextWeek);
    changeWeek(nextDay);
  };

  const calendarColumns = () => {
    const columns = [];

    if (daysOfWeek.length === 0) {
      return;
    }

    for (let i = 0; i < numberOfColumns; i++) {
      const title = daysOfWeek[i].format("D");
      const subtitle = daysOfWeek[i].format("ddd");
      columns.push(
        <CalendarColumn
          date={daysOfWeek[i]}
          title={title}
          subtitle={subtitle}
          events={events}
          isLast={i === numberOfColumns - 1}
          key={"column_day_" + i}
          shouldScrollTo={shouldScrollTo}
          onClickCell={onClickCell}
        />
      );
    }

    return columns;
  };

  const gridStyles = {
    gridTemplateColumns: `0.5fr repeat(${numberOfColumns}, minmax(0, 2fr))`,
  };

  return (
    <div>
      <div className="grid" style={gridStyles}>
        <div>
          <div className="flex gap-x-5 items-center justify-center bg-[#fafafb] dark:bg-[#020817] z-50 border-[#f4f3fb] border-[1px] h-24 sticky top-[57px] ">
            <Button onClick={decDay} size="icon" variant="ghost">
              <ChevronLeft size="20px" />
            </Button>
            <Button onClick={incDay} size="icon" variant="ghost">
              <ChevronRight size="20px" />
            </Button>
          </div>
          <div className="flex flex-col items-center">{hours}</div>
        </div>
        {calendarColumns()}
      </div>
    </div>
  );
}
