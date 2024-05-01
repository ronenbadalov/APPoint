import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(req: any) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "not authenticated" }), {
        status: 401,
      });
    }
    const businessDetails = await prisma.businessDetails.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        services: true,
        workingHours: true,
      },
    });

    return new NextResponse(JSON.stringify(businessDetails), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
