import { options } from "@/app/api/auth/[...nextauth]/options";
import { BUSINESSES_PER_PAGE } from "@/lib/explore";
import prisma from "@/lib/prisma";
import { BusinessDetails } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export async function GET(req: any) {
  try {
    const pageNumber = parseInt(req.nextUrl.searchParams.get("page") || "0");
    const query = req.nextUrl.searchParams.get("query");
    const latitude = parseFloat(req.nextUrl.searchParams.get("latitude"));
    const longitude = parseFloat(req.nextUrl.searchParams.get("longitude"));
    const session = await getServerSession(options);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "not authenticated" }), {
        status: 401,
      });
    }

    const businesses: any[] = await prisma.$queryRaw`
    SELECT 
      b.*,
      json_agg(s.*) FILTER (WHERE s.id IS NOT NULL) as services,
      json_agg(w.*) FILTER (WHERE w.id IS NOT NULL) as working_hours,
      earth_distance(
        ll_to_earth(${latitude}, ${longitude}),
        ll_to_earth(b.latitude, b.longitude)
    ) / 1000 AS distance_km 
    FROM 
      "business_details" AS b
    LEFT JOIN 
      "services" AS s ON b.id = s.business_id
    LEFT JOIN 
      "working_hours" AS w ON b.id = w.business_id
    WHERE 
      b."business_name" ILIKE '%' || ${query} || '%' OR
      b."address" ILIKE '%' || ${query} || '%'
    GROUP BY 
      b.id
    ORDER BY 
    distance_km 
    LIMIT 
      ${BUSINESSES_PER_PAGE}
    OFFSET 
      ${pageNumber * BUSINESSES_PER_PAGE};
  `;

    const response: Omit<BusinessDetails, "userId">[] = businesses.map(
      (business) => {
        return {
          id: business.id,
          businessName: business.business_name,
          address: business.address,
          latitude: business.latitude,
          longitude: business.longitude,
          services: business.services,
          workingHours: business.working_hours,
          description: business.description,
          imageUrl: business.image_url,
          phone: business.phone,
          distance: business.distance_km,
        };
      }
    );

    return new NextResponse(JSON.stringify(response), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: "an error occured" }), {
      status: 500,
    });
  }
}
