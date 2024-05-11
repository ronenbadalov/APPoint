import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Slug {
  id: string;
}

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: Slug }
) {
  try {
    console.log(id);
    let businessDetails = await prisma.businessDetails.findFirst({
      where: {
        id,
      },
      include: {
        services: true,
        workingHours: true,
      },
    });

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
