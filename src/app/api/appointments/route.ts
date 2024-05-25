import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  if (session?.user.role !== "BUSINESS") {
    return new NextResponse(
      JSON.stringify({ error: "Not allowed to get business appointments" }),
      {
        status: 500,
      }
    );
  }

  const businessDetails = await prisma.businessDetails.findFirst({
    select: {
      id: true,
    },
    where: {
      userId: {
        equals: session.user.id,
      },
    },
  });

  const data = await prisma.appointment.findMany({
    select: {
      id: true,
      date: true,
      status: true,
      service: {
        select: {
          id: true,
          duration: true,
          name: true,
          description: true,
          price: true,
        },
      },
    },
    where: {
      AND: {
        businessId: {
          equals: businessDetails?.id,
        },
      },
    },
  });

  return new NextResponse(JSON.stringify(data), {
    status: 200,
  });
}

