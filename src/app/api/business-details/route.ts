import { options } from "@/app/api/auth/[...nextauth]/options";
import { BUSINESSES_PER_PAGE } from "@/lib/explore";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export async function GET(req: any) {
  try {
    const pageNumber = req.nextUrl.searchParams.get("page") || 0;
    const session = await getServerSession(options);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "not authenticated" }), {
        status: 401,
      });
    }

    const businesses = await prisma.businessDetails.findMany({
      skip: pageNumber * BUSINESSES_PER_PAGE,
      take: BUSINESSES_PER_PAGE,
      orderBy: {
        id: "asc",
      },
      include: {
        services: true,
        workingHours: true,
      },
    });

    // delete userId from response
    const response = businesses.map((business) => {
      return {
        ...business,
        userId: undefined,
      };
    });

    return new NextResponse(JSON.stringify(response), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
