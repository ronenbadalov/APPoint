import { AppointmentStatus, Role } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { eventUI } from "../types";

export default function EventCalendar(props: eventUI) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const top = `top-${props.top}`;

  let statusBg: string | null = null;
  let borderColor: string | null = null;

  switch (props.status) {
    case AppointmentStatus.PENDING_BUSINESS:
    case AppointmentStatus.PENDING_CUSTOMER:
      borderColor = "#4bbde0";

      if (props.customerId) {
        statusBg = borderColor;
      }
      break;
    case AppointmentStatus.CONFIRMED:
      borderColor = "#B5D09C";

      if (props.customerId) {
        statusBg = borderColor;
      }
      break;
    case AppointmentStatus.CANCELLED:
      borderColor = "#8B8B8D";

      if (props.customerId) {
        statusBg = borderColor;
      }
      break;
  }

  const isDisabledCell = new Date(props.date) < new Date();

  if (isDisabledCell) {
    statusBg = "gray";
    borderColor = "gray";
  }

  const inlineStyles = {
    top: `${props.top}px`,
    left: `${props.left}%`,
    height: `${props.height}px`,
    width: `${props.width}%`,
    backgroundColor: statusBg || "",
    border: borderColor ? `1px solid ${borderColor}` : "",
    PointerEvent: props.customerId ? "cursor" : "none",
    cursor: props.customerId ? 'pointer' : 'not-allowed'
  };

  const onClickEvent = () => {
    const params = new URLSearchParams(searchParams);
    if (
      (session?.user.role === Role.CUSTOMER && props.customerId && new Date(props.date) > new Date()) ||
      session?.user.role === Role.BUSINESS
    ) {
      params.set("edit", props.id);
    } else if (props.customerId && session?.user.role === Role.CUSTOMER) {
      params.set("details", props.id);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      onClick={onClickEvent}
      style={inlineStyles}
      className={`rounded-[12px] p-2 absolute flex items-center flex-col w-full ${
        !props.customerId ? "bg-background" : ""
      } ${top}`}
    >
      <div className="text-[11px] font-bold text-[#283a40] dark:text-white">
        {props.service.name}
      </div>
      <div className="mt-1 text-[10px] text-black dark:text-white tracking-wide">
        {moment(Number(new Date(props.date))).format("HH:mm")} -{" "}
        {moment(
          Number(
            moment(new Date(props.date))
              .add(props.service.duration, "minutes")
              .toDate()
          )
        ).format("HH:mm")}
      </div>
    </div>
  );
}
