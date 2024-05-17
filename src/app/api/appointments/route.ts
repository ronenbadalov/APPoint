import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "not authenticated" }), {
      status: 401,
    });
  }

  let data: any[] = [];
  if (session?.user.role === "CUSTOMER") {
    const customerDetails = await prisma.customerDetails.findFirst({
      select: {
        id: true,
      },
      where: {
        userId: {
          equals: session.user.id,
        },
      },
    });
    if (!customerDetails)
      return new NextResponse(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
      });

    data = await prisma.appointment.findMany({
      include: {
        business: true,
        service: true,
      },
      where: {
        customerId: customerDetails.id,
      },
    });
  } else if (session?.user.role === "BUSINESS") {
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

    data = await prisma.appointment.findMany({
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
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (session?.user.role !== "BUSINESS") {
    return new NextResponse(
      JSON.stringify({ error: "Not allowed to get business appointments" }),
      {
        status: 500,
      }
    );
  }
}
