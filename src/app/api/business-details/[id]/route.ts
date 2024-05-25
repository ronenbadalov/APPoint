import prisma from "@/lib/prisma";
import { BusinessData } from "@/queries";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";

interface Slug {
  id: string;
}

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: Slug }
) {
  const session = await getServerSession(options);
  if (!session?.user?.id)
    return new NextResponse(JSON.stringify({ error: "not authenticated" }), {
      status: 401,
    });

  const consumerDetails = await prisma.customerDetails.findFirst({
    select: {
      id: true,
    },
    where: {
      userId: session.user.id,
    },
  });

  try {
    let businessDetails = (await prisma.businessDetails.findFirst({
      where: {
        id,
      },
      include: {
        services: true,
        workingHours: true,
        appointments: {
          include: {
            service: true,
          },
        },
      },
    })) as unknown as BusinessData;

    if (businessDetails?.appointments) {
      businessDetails.appointments = businessDetails.appointments.map(
        (appointment) => ({
          ...appointment,
          customerId:
            consumerDetails?.id === appointment.customerId
              ? appointment.customerId
              : undefined,
        })
      );
    }

    const descServicesSorted =
      businessDetails?.services.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      ) || [];

    if (businessDetails) businessDetails.services = descServicesSorted;

    return new NextResponse(JSON.stringify(businessDetails), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
