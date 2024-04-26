export { default } from "next-auth/middleware";

// RONEN-TODO: routes are not protected
export const config = {
  matcher: ["/", "/my-business"],
  exclude: ["/login", "/signup"],
};
