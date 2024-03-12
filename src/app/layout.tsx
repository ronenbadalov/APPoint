import { ThemeProvider } from "@/context/themeContext";
import "@/styles/globals.css";
import type { ChildrenProps } from "@/types";
import { Inter } from "next/font/google";

export const metadata = {
  description:
    "A highly opinionated and complete starter for Next.js projects ready to production. Includes Typescript, Styled Components, Prettier, ESLint, Husky, SEO, and more.",
  keywords:
    "next, starter, typescript, tailwind css, prettier, eslint, husky, seo",
  title: "Next Starter",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export default async function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
