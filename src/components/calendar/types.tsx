import { AppointmentStatus } from "@prisma/client";
import { Moment } from "moment";
import { Control } from "react-hook-form";

export enum CalendarViews {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
}

export interface Event {
  id: String;
  title: String;
  description?: String;
  startDate: number;
  endDate: number;
  image?: String;
  //todo: add more if needed
}

export interface DayEvent {
  date: Moment;
  title: String;
  subtitle: String;
  events?: Appointment[];
}

export interface Events {
  title: String;
  days: DayEvent[];
  month: number;
  year: number;
}

export interface Service {
  id: String;
  duration: number;
  name: String;
  description: String;
  price: number;
}

export interface Appointment {
  id: string;
  date: string;
  status: AppointmentStatus;
  service: Service;
}

export interface FormItemCalendar {
  name: 'startDate' | 'status';
  label?: string;
  placeholder?: string;
  control: Control<{ startDate: Date; status: AppointmentStatus }, any>;
}

export interface eventUI extends Appointment {
  height: number;
  width: number;
  top: Number;
  left: Number;
}
