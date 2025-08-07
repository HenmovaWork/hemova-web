"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slide } from "@/lib/types";

const Carousel = ({ slides }: { slides: Slide[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsAutoPlaying(false);
    // Resume auto-play after 3 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 3000);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
    resetTimer();
  }, [slides.length, resetTimer]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      resetTimer();
    },
    [resetTimer]
  );

  const handleNextSlide = useCallback(() => {
    nextSlide();
    resetTimer();
  }, [nextSlide, resetTimer]);

  // Auto-advance timer
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    intervalRef.current = setInterval(nextSlide, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nextSlide, isAutoPlaying, slides.length]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] 2xl:h-[90vh] overflow-hidden select-none bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.slug}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div className="relative w-full h-full">
            <Image
              draggable={false}
              src={slide.backgroundImage?.src ?? ""}
              alt={slide.backgroundImage?.alt || "Carousel background"}
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              priority={index === 0}
              quality={90}
              className="select-none"
              sizes="100vw"
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end items-center pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4">
            {/* Title Image */}
            {slide.titleImage && (
              <div
                className={`transition-all duration-700 ease-out mb-4 sm:mb-6 md:mb-8 ${
                  index === currentIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <Image
                  draggable={false}
                  className="select-none w-auto h-12 sm:h-16 md:h-20 lg:h-24 max-w-[280px] sm:max-w-[350px] md:max-w-[400px]"
                  src={slide.titleImage.src}
                  alt={slide.titleImage.alt || "Slide title"}
                  width={slide.titleImage.width || 400}
                  height={slide.titleImage.height || 120}
                  priority={index === 0}
                  quality={85}
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, 400px"
                />
              </div>
            )}

            {/* Overlay Text */}
            <div
              className={`text-white/90 text-sm sm:text-base md:text-lg font-normal max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl text-center mb-6 sm:mb-8 md:mb-10 transition-all duration-700 delay-200 ${
                index === currentIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {slide.overlayText}
            </div>

            {/* CTA Buttons */}
            {slide.ctaButtons && slide.ctaButtons.length > 0 && (
              <div
                className={`flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none justify-center transition-all duration-700 delay-300 ${
                  index === currentIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {slide.ctaButtons.map((button: any, btnIndex: number) => (
                  <Link
                    key={btnIndex}
                    href={button.url}
                    target={button.target}
                    className={`px-4 sm:px-6 py-2.5 sm:py-3 text-center text-sm sm:text-base rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                      button.style === "primary"
                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                        : button.style === "secondary"
                        ? "border-2 border-white text-white hover:bg-white hover:text-black hover:scale-105"
                        : "border-2 border-white text-white hover:bg-white hover:text-black hover:scale-105"
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

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 sm:left-4 md:left-6 lg:left-8 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute top-1/2 right-2 sm:right-4 md:right-6 lg:right-8 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
