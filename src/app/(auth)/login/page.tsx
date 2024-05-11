import { options } from "@/app/api/auth/[...nextauth]/options";
import { paths } from "@/lib/paths";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./form";

export default async function LoginPage() {
  const session = await getServerSession(options);
  if (session && session.user && !session.user.role) {
    redirect(paths.SELECT_ROLE);
  }
  return <LoginForm />;
}
