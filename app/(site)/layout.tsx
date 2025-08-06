import type { ReactNode } from "react";
import "./styles.css";

import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import { Toaster } from "@/components/ui/sonner";
import SupportFloatingBtn from "@/components/site/support-floating-btn";
import ErrorTest from "@/components/ui/error-test";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      <div className="flex min-h-screen w-full flex-col">
        <Navbar />
        <main className="border-t flex min-h-[calc(100vh-(--spacing(16)))] flex-1 flex-col gap-4 bg-muted/40">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster richColors />
      <SupportFloatingBtn />
      <ErrorTest />
    </div>
  );
}
