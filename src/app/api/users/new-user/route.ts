import prisma from "@/lib/prisma";
import { UserService } from "@/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    await UserService.handleNewUserDetails(updatedUser);
    return new NextResponse(undefined, {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
