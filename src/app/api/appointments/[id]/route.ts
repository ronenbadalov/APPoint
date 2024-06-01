import prisma from "@/lib/prisma";
import { AppointmentStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";

interface Slug {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: Slug }
) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id)
      return new NextResponse(JSON.stringify({ error: "not authenticated" }), {
        status: 401,
      });

    let updatedBusinessDetails = null;
    if (session.user.role === Role.BUSINESS) {
      const businessDetails = await prisma.businessDetails.findFirst({
        select: {
          id: true,
        },
        where: {
          userId: session.user.id,
        },
      });

      if (!businessDetails?.id) {
        return new NextResponse(
          JSON.stringify({ error: "Bussiness not found" }),
          {
            status: 401,
          }
        );
      }

      const { date, status } = await req.json();
      updatedBusinessDetails = await prisma.appointment.update({
        where: {
          id,
          businessId: businessDetails?.id,
        },
        data: {
          date,
          status,
        },
      });
    } else {
      const customerDetails = await prisma.customerDetails.findFirst({
        select: {
          id: true,
        },
        where: {
          userId: session.user.id,
        },
      });

      if (!customerDetails?.id) {
        return new NextResponse(
          JSON.stringify({ error: "Customer not found" }),
          {
            status: 401,
          }
        );
      }

      const { date } = await req.json();

      updatedBusinessDetails = await prisma.appointment.update({
        where: {
          id,
          customerId: customerDetails?.id,
        },
        data: {
          date,
          status: AppointmentStatus.PENDING_BUSINESS,
        },
      });
    }

    return new NextResponse(JSON.stringify(updatedBusinessDetails), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: Slug }
) {
  const session = await getServerSession(options);
  if (session?.user.role !== "CUSTOMER") {
    return new NextResponse(
      JSON.stringify({ error: "Not allowed to add appointment" }),
      {
        status: 500,
      }
    );
  }

  const customerDetails = await prisma.customerDetails.findFirst({
    select: {
      id: true,
    },
    where: {
      userId: session.user.id,
    },
  });

  if (!customerDetails) {
    return new NextResponse(
      JSON.stringify({ error: "Customer is not exist" }),
      {
        status: 401,
      }
    );
  }

  const { date, serviceId } = await req.json();

  if (!date || !serviceId) {
    return new NextResponse(
      JSON.stringify({ error: "Please fill all fields" }),
      {
        status: 401,
      }
    );
  }

  try {
    const appointmentData = await prisma.appointment.create({
      data: {
        customerId: customerDetails.id,
        businessId: id,
        serviceId,
        date,
        status: "PENDING_BUSINESS",
      },
    });

    return new NextResponse(JSON.stringify(appointmentData), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
