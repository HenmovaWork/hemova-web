import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Henmova",
  description: "Game Development Agency",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-[#F9FCFF]",
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
