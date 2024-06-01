import { WorkingHours } from "@prisma/client";
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

interface Collision {
  [id: string]: { group: number };
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
  const dimensionsAppointments: EventDimension[] = [];

  let groups = 0;
  const colisions: Collision = {};
  for (const event of events) {
    let collisionsEvents = 0; // will shrink the width
    const eventStartDate = new Date(
      new Date(event.date).setSeconds(0, 0)
    ).getTime();
    const endDate = moment(eventStartDate)
      .seconds(0)
      .milliseconds(0)
      .add(event.service.duration, "minutes")
      .toDate()
      .getTime();

    const dayStart = moment(eventStartDate)
      .clone()
      .set("hour", 0)
      .set("minutes", 0);
    const { top, height } = calcEventHightAndTop(
      dayStart,
      hoursHeight,
      moment(eventStartDate).clone(),
      moment(eventStartDate).clone().add(event.service.duration, "minutes")
    );

    dimensionsAppointments.push({
      top,
      height,
      width: 93,
      left: 3,
      ...event,
    });

    for (let j = 0; j < events.length; j++) {
      const secondEvent = events[j];
      if (event.id === secondEvent.id) {
        continue;
      }

      const secondEventStartDate = new Date(
        new Date(secondEvent.date).setSeconds(0, 0)
      ).getTime();
      const secondEventEndDate = moment(secondEventStartDate)
        .add(event.service.duration, "minutes")
        .seconds(0)
        .milliseconds(0)
        .toDate()
        .getTime();

      if (
        (secondEventEndDate > eventStartDate && secondEventEndDate < endDate) ||
        (secondEventStartDate >= eventStartDate &&
          secondEventEndDate <= endDate) ||
        (secondEventStartDate > eventStartDate &&
          secondEventStartDate < endDate)
      ) {
        if (colisions[secondEvent.id]) {
          colisions[event.id] = { group: colisions[secondEvent.id].group };
        }
        if (!colisions[event.id]) {
          colisions[event.id] = { group: groups };
          groups++;
        }

        if (colisions[event.id] && !colisions[secondEvent.id]) {
          colisions[secondEvent.id] = { group: colisions[event.id].group };
        }
      }
    }
  }

  let colisionGroups: string[][] = [];
  for (const [colisionKey, colisionValue] of Object.entries(colisions)) {
    if (!colisionGroups[colisionValue.group]) {
      colisionGroups[colisionValue.group] = [];
    }

    colisionGroups[colisionValue.group].push(colisionKey);
  }

  for (const group of colisionGroups) {
    let groupItemCount = 0;
    for (const colisionId of group) {
      const colisionIdx = dimensionsAppointments.findIndex(
        (c) => c.id === colisionId
      );
      dimensionsAppointments[colisionIdx].width = 100 / group.length - 7;

      dimensionsAppointments[colisionIdx].left =
        (100 / group.length) * groupItemCount + 3;
      groupItemCount++;
    }
  }

  return dimensionsAppointments;
}

export function isInWorkingHours(
  workingHours: WorkingHours | null,
  currentDay: Moment,
  currentHour: number,
  serviceDuration: number
): boolean {
  if (!workingHours) {
    return true;
  }

  const startTime = new Date(new Date(workingHours?.startTime || 0)).getHours();
  const endTime = new Date(new Date(workingHours?.endTime || 0)).getHours();
  if (
    new Date().setMinutes(0, 0, 0) <=
      Number(currentDay.toDate().setMinutes(0, 0, 0)) &&
    !workingHours?.isClosed &&
    startTime <= currentHour
  ) {
    console.log("eee", serviceDuration, endTime );
    if (
      endTime === currentHour &&
      new Date(new Date(workingHours?.endTime || 0)).getMinutes() !== 0
    ) {
      return false;
    }

    if (endTime >= currentHour + serviceDuration) {
      return true;
    }
  }

  return false;
}
