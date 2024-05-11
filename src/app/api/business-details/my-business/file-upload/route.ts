import { options } from "@/app/api/auth/[...nextauth]/options";
import { del, list, put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("image") as File;

    const session = await getServerSession(options);
    if (!session?.user?.id)
      return new NextResponse(JSON.stringify({ error: "not authenticated" }), {
        status: 401,
      });

    if (!file) {
      return new NextResponse(JSON.stringify({ error: "no file provided" }), {
        status: 400,
      });
    }
    const res = await list({
      token: process.env.APPOINT_IMAGE_DB_READ_WRITE_TOKEN,
    });
    if (res && res.blobs && res.blobs.length > 0) {
      res.blobs.forEach(async (blob) => {
        if (!blob.pathname.includes(session.user.id)) return;
        await del(blob.url, {
          token: process.env.APPOINT_IMAGE_DB_READ_WRITE_TOKEN,
        });
      });
    }

    const blob = await put(`${session.user.id}-${file.name}`, file, {
      access: "public",
      token: process.env.APPOINT_IMAGE_DB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });

    return new NextResponse(JSON.stringify(blob.url), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
