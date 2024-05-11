import { options } from "@/app/api/auth/[...nextauth]/options";
import { paths } from "@/lib/paths";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import FormPage from "./form";

export default async function SignUpPage() {
  const session = await getServerSession(options);
  if (session && session.user && !session.user.role) {
    redirect(paths.SELECT_ROLE);
  }
  return <FormPage />;
}
