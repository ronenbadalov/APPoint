import { LogoutButton } from "@/components/LogoutButton/LogoutButton";
import { ModeToggle } from "@/components/ModeToggle";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();
  return (
    <section className="p-8 flex flex-col justify-center">
      <h1 className="text-3xl font-bold font-poppins">{session?.user?.name}</h1>
      <p className="text-lg">
        A highly opinionated and complete starter for Next.js projects ready to
        production
      </p>
      <ModeToggle />
      <LogoutButton />
    </section>
  );
}
