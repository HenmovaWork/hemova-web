"use client";

import { useState } from "react";

import ActiveLink from "./active-link";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

export default function MobileNav({
  links,
}: {
  links: { name: string; href: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex w-full justify-between items-center">
        <Link href="/">
          <Image
            draggable={false}
            className="  w-30 object-cover"
            src={"/logos/logo-2.webp"}
            alt="Henmova Logo"
            width={96}
            height={32}
            style={{ objectFit: "contain" }}
            quality={85}
            priority
          />
          <span className="sr-only">Henmova</span>
        </Link>

        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent side="right">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setIsOpen(false)}
          >
            <Image
              draggable={false}
              src={"/logos/logo-2.svg"}
              alt="Henmova Logo"
              width={96}
              height={32}
              quality={85}
              loading="lazy"
            />
            <span className="sr-only">Henmova</span>
          </Link>
          {links.map((link) => (
            <ActiveLink
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </ActiveLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
