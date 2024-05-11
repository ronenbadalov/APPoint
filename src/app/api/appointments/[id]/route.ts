import prisma from "@/lib/prisma";
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
        JSON.stringify({ error: "Bussiness is not available for this user" }),
        {
          status: 401,
        }
      );
    }

    const { date, status } = await req.json();
    const updatedBusinessDetails = await prisma.appointment.update({
      where: {
        id,
        businessId: businessDetails?.id,
      },
      data: {
        date,
        status,
      },
    });

    return new NextResponse(JSON.stringify(updatedBusinessDetails), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
