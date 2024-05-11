import moment, { Moment } from "moment";
import { Appointment } from "./../types";

type TopAndHeight = {
  height: number;
  top: number;
};

interface EventDimension extends Appointment {
  height: number;
  width: number;
  top: number;
  left: number;
}

export function calcEventHightAndTop(
  dayStart: Moment,
  hourHeight: number,
  startDate: Moment,
  endDate: Moment
): TopAndHeight {
  let duration = moment.duration(endDate.diff(startDate));
  const height = (duration.asMinutes() / 60) * hourHeight;

  duration = moment.duration(startDate.diff(dayStart));
  const top = (duration.asMinutes() / 60) * hourHeight;

  return {
    height,
    top,
  };
}

export function calcEventDimesionsAndTop(
  hoursHeight: number,
  events: Appointment[]
): EventDimension[] {
  const arr = [];
  for (const event of events) {
    let collisionsEvents = 0; // will shrink the width
    const eventStartDate = new Date(event.date).getTime();
    const endDate = eventStartDate + event.service.duration * 60 * 60;

    const dayStart = moment(eventStartDate)
      .clone()
      .set("hour", 0)
      .set("minutes", 0);
    const { top, height } = calcEventHightAndTop(
      dayStart,
      hoursHeight,
      moment(eventStartDate),
      moment(eventStartDate).add(event.service.duration, "minutes")
    );

    const colisions = [];
    for (let i = 0; i < arr.length; i++) {
      const secondEventStartDate = new Date(arr[i].date).getTime();
      const secondEventEndDate = moment(secondEventStartDate).add(arr[i].service.duration, "minutes").toDate()

      // collision
      if (
        (endDate >= secondEventStartDate && endDate <= secondEventStartDate) ||
        (eventStartDate >= secondEventStartDate &&
          eventStartDate <= Number(secondEventEndDate))
      ) {
        collisionsEvents++;
        colisions.push(i);
      }
    }

    let prevWidth = 0;
    for (let i = 0; i < colisions.length; i++) {
      arr[i].width = (100 / (collisionsEvents + 1)) - 1.5;

      arr[i].left = 0;
      if (i - 1 >= 0) {
        arr[i].left = prevWidth + 3;
        prevWidth += 3;
      }
      prevWidth += arr[i].width;
    }

    const dimension = {
      top,
      left: colisions.length !== 0 ? prevWidth + 3 : 0,
      height,
      width: collisionsEvents !== 0 ? (100 / (collisionsEvents + 1)) - 1.5 : 100, // percentage
    };

    arr.push({ ...event, ...dimension });
  }

  return arr;
}
