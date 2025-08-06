"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slide } from "@/lib/types";

const Carousel = ({ slides }: { slides: Slide[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length,
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative h-160 sm:h-152 w-full overflow-hidden select-none">
      {slides.map((slide, index) => (
        <div
          key={slide.slug}
          className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
          draggable={false}
            src={slide.backgroundImage?.src ?? ""}
            alt={slide.backgroundImage?.alt || "Carousel background"}
            fill
            style={{ objectFit: "cover" }}
            priority={index === 0} // Prioritize first image
            quality={90}
            className="select-none"
          />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-center items-center gap-3">
            {slide.titleImage && (
              <Image
                className={`absolute left-1/2 -translate-x-1/2 transition-all ease-in-out duration-500 w-56  select-none ${index === currentIndex
                  ? "bottom-56 opacity-100"
                  : "bottom-40 opacity-0"
                  }`}
                src={slide.titleImage.src}
                alt={slide.titleImage.alt || "Slide title"}
                width={slide.titleImage.width || 224}
                height={slide.titleImage.height || 80}
                priority={index === 0}
                quality={85}
              />
            )}
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 text-white/75 font-normal w-[80%] sm:max-w-md line-clamp-2 text-center">
              {slide.overlayText}
            </div>
            {slide.ctaButtons && slide.ctaButtons.length > 0 && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-4 max-sm:flex-col">
                {slide.ctaButtons.map((button: any, btnIndex: number) => (
                  <Link
                    key={btnIndex}
                    href={button.url}
                    className={`px-6 py-3 text-center rounded-lg font-semibold transition-all ${button.style === "primary"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : button.style === "secondary"
                        ? "border-2 border-white text-white hover:bg-white hover:text-black"
                        : "border-2 border-white text-white hover:bg-white hover:text-black"
                      }`}
                  >
                    {button.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-[8dvw] transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-[8dvw] transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex
              ? "bg-white"
              : "bg-transparent border border-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
