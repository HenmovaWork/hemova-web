"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import {
  getOptimizedImageProps,
  OptimizedImageProps,
  FALLBACK_IMAGES,
  FallbackImageType,
} from "@/lib/image-utils";

interface OptimizedImageComponentProps
  extends Omit<ImageProps, "src" | "alt" | "placeholder"> {
  src: string;
  alt: string;
  fallbackType?: FallbackImageType;
  showFallback?: boolean;
  placeholder?: "blur" | "empty" | "blur-sm";
}

/**
 * Optimized Image component with error handling and fallbacks
 */
export default function OptimizedImage({
  src,
  alt,
  fallbackType = "game",
  showFallback = true,
  priority = false,
  quality = 85,
  placeholder = "blur-sm",
  loading = "lazy",
  className,
  onError,
  ...props
}: OptimizedImageComponentProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoading(false);

    if (onError) {
      onError(event);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Use fallback image if there's an error and showFallback is true
  const imageSrc =
    hasError && showFallback ? FALLBACK_IMAGES[fallbackType] : src;

  const optimizedProps = getOptimizedImageProps({
    src: imageSrc,
    alt,
    priority,
    quality: typeof quality === "number" ? quality : Number(quality),
    placeholder:
      placeholder === "blur-sm" || placeholder === "empty"
        ? placeholder
        : "blur-sm",
    loading,
    fallbackType,
  });

  return (
    <div className={`relative ${className || ""}`}>
      <Image
        {...props}
        {...optimizedProps}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className || ""}`}
        onError={handleError}
        onLoad={handleLoad}
        alt="invalid image"
      />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-transparent animate-pulse rounded" />
      )}

      {/* Error state indicator (optional) */}
      {hasError && showFallback && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-75">
          Fallback
        </div>
      )}
    </div>
  );
}

/**
 * Specialized components for different image types
 */

export function GameImage(
  props: Omit<OptimizedImageComponentProps, "fallbackType">,
) {
  return <OptimizedImage {...props} fallbackType="game" />;
}

export function BlogImage(
  props: Omit<OptimizedImageComponentProps, "fallbackType">,
) {
  return <OptimizedImage {...props} fallbackType="blog" />;
}

export function LogoImage(
  props: Omit<OptimizedImageComponentProps, "fallbackType">,
) {
  return <OptimizedImage {...props} fallbackType="logo" priority />;
}

export function IconImage(
  props: Omit<OptimizedImageComponentProps, "fallbackType">,
) {
  return <OptimizedImage {...props} fallbackType="icon" />;
}

export function CarouselImage(
  props: Omit<OptimizedImageComponentProps, "fallbackType">,
) {
  return <OptimizedImage {...props} fallbackType="carousel" priority />;
}
