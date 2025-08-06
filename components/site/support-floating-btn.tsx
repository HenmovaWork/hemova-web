"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CircleHelp, Mail } from "lucide-react";

export default function SupportFloatingBtn() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger
        asChild
        className="cursor-pointer rounded-full fixed bottom-0 right-0 m-8 transition-all duration-300 group"
        onClick={toggleCard}
      >
        <CircleHelp fill="#fff" stroke="#f00" strokeWidth={1.5} size={62} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80 mr-8">
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-lg font-semibold text-primary">Henmova</h4>
            <p className="text-sm">
              We&apos;re here to help. Get in touch with us.
            </p>
          </div>
          <div className="flex justify-around">
            <div className="space-y-1">
              <a
                href="mailto:henmova.official@gmail.com"
                className="flex items-center space-x-2 text-primary text-sm"
              >
                <Mail size={24} />
                <span className="text-sm font-medium">Founder</span>
              </a>
            </div>
            <div className="space-y-1">
              <a
                href="mailto:sagathiyasoham12345@gmail.com"
                className="flex items-center space-x-2 text-primary text-sm"
              >
                <Mail size={24} />
                <span className="text-sm font-medium">Developer</span>
              </a>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
