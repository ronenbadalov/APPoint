import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Slug {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: Slug }
) {
  try {
    const body = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
    });
    return new NextResponse(JSON.stringify({ updatedUser }), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
