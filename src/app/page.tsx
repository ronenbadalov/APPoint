import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <section className="p-8 flex flex-col h-full justify-center">
      <h1 className="text-3xl font-bold font-poppins">Next Starter ⚡</h1>
      <p className="text-lg">
        A highly opinionated and complete starter for Next.js projects ready to
        production
      </p>
      <ModeToggle />
    </section>
  );
}
