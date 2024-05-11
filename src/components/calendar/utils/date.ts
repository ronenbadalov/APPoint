import { Moment } from "moment";

function getStartOfTheWeek(moment: Moment): Moment {
  return moment.startOf("isoWeek").weekday(0);
}

export function getDaysOfWeekByDay(day: Moment): Moment[] {
  const days = [];
  let dayIterator = getStartOfTheWeek(day);
  for (let i = 0; i < 7; i++) {
    days.push(dayIterator.clone().add(i, "day"));
  }

  return days;
}

export function getDays(day: Moment, days: number): Moment[] {
  const arr = [];
  for (let i = 0; i < days; i++) {
    arr.push(day);
    day = day.clone().add(1, "day");
  }

  return arr;
}
