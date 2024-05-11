import { AppointmentStatus } from "@prisma/client";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { eventUI } from "../types";


export default function EventCalendar(props: eventUI) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const top = `top-${props.top}`;

  let statusBg: string | null = null;
  let borderColor: string | null = null;
  let opacity = "100";
  switch (props.status) {
    case AppointmentStatus.PENDING_BUSINESS:
    case AppointmentStatus.PENDING_CUSTOMER:
      borderColor = "#4bbde0";
      statusBg = "#FFFFFF";
      break;
    case AppointmentStatus.CONFIRMED:
      statusBg = "#4bbde0";
      borderColor = "#4bbde0";
      break;
    case AppointmentStatus.CANCELLED:
      borderColor = "#90ecfa";
      statusBg = "#90ecfa";
      opacity = "0.4";
      break;
  }

  const inlineStyles = {
    top: `${props.top}px`,
    left: `${props.left}%`,
    height: `${props.height}px`,
    width: `${props.width}%`,
    backgroundColor: statusBg || "",
    border: borderColor ? `1px solid ${borderColor}` : "",
    opacity,
  };

  const onClickEvent = () => {
    const params = new URLSearchParams(searchParams);
    params.set("edit", props.id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      onClick={onClickEvent}
      style={inlineStyles}
      className={
        "rounded-[12px] p-2 absolute flex items-center flex-col w-full cursor-pointer " +
        top
      }
    >
      <div className="text-[11px] font-bold text-[#283a40]">
        {props.service.name}
      </div>
      <div className="mt-1 text-[10px] text-[#655d75] tracking-wide">
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
