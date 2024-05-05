import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(req: any) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "not authenticated" }), {
        status: 401,
      });
    }
    let businessDetails = await prisma.businessDetails.findFirst({
      where: {
        userId: session.user.id,
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

export async function PATCH(req: NextRequest) {
  try {
    const { workingHours, services, ...rest } = await req.json();
    const session = await getServerSession(options);
    if (!session?.user?.id)
      return new NextResponse(JSON.stringify({ error: "not authenticated" }), {
        status: 401,
      });
    const updatedBusinessDetails = await prisma.businessDetails.update({
      where: { userId: session.user.id },
      data: rest,
    });

    if (workingHours) {
      await prisma.workingHours.deleteMany({
        where: { businessId: updatedBusinessDetails.id },
      });
      await prisma.workingHours.createMany({
        data: workingHours.map((wh: any) => ({
          ...wh,
          businessId: updatedBusinessDetails.id,
        })),
      });
    }

    if (services) {
      await prisma.service.deleteMany({
        where: {
          businessId: updatedBusinessDetails.id,
          id: {
            notIn: services.filter((s: any) => s.id).map((s: any) => s.id),
          },
        },
      });
      await prisma.service.createMany({
        data: services
          .filter((service: any) => !service.id)
          .map((service: any) => ({
            ...service,
            businessId: updatedBusinessDetails.id,
          })),
      });

      await Promise.all(
        services
          .filter((service: any) => service.id)
          .map((service: any) =>
            prisma.service.update({
              where: { id: service.id },
              data: service,
            })
          )
      );
    }

    return new NextResponse(JSON.stringify({ updatedBusinessDetails }), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
