export { default } from "next-auth/middleware";

// RONEN-TODO: routes are not protected
export const config = {
  matcher: ["/", "/my-business"],
  exclude: ["/login", "/signup"],
};

// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   const url = request.nextUrl.clone();
//   console.log(url);
//   NextResponse.redirect(url);
// }
