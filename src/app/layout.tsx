import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/themeContext";
import "@/styles/globals.css";
import type { ChildrenProps } from "@/types";
import { Inter } from "next/font/google";

export const metadata = {
  description:
    "APPoint is a free appointment booking system that allows you to schedule appointments, manage your calendar, and book appointments with ease.",
  keywords:
    "appointments, calendar, schedule, appointment, booking, booking system, appointment system, appointment booking, appointment scheduling, appointment calendar, appointment app, appointment booking system, appointment booking app, appointment booking calendar, appointment booking schedule, appointment booking system app, appointment booking system calendar, appointment booking system schedule, appointment booking app calendar, appointment booking app schedule, appointment booking calendar schedule, appointment booking system app calendar, appointment booking system app schedule, appointment booking system calendar schedule, appointment booking",
  title: "APPoint",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export default async function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="container relative" id="root">{children}</div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
