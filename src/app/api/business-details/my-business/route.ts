import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    const session = await getSession({ req });
    console.log(session);

    return new NextResponse(JSON.stringify({ test: 1 }), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
