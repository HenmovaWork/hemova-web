/**
 * Image optimization utilities for Next.js Image component
 */

// Default blur data URL for placeholder
export const DEFAULT_BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

// Default fallback image paths
export const FALLBACK_IMAGES = {
  game: "/temp-img.png",
  blog: "/temp-img.png",
  logo: "/logos/logo-2.svg",
  icon: "/temp-img.png",
  carousel: "/temp-img.png",
} as const;

export type FallbackImageType = keyof typeof FALLBACK_IMAGES;

/**
 * Get optimized image props for Next.js Image component
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty" | "blur-sm";
  blurDataURL?: string;
  loading?: "lazy" | "eager";
  fallbackType?: FallbackImageType;
}

export function getOptimizedImageProps({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  placeholder = "blur-sm",
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  loading = "lazy",
  fallbackType = "game",
}: OptimizedImageProps) {
  // Convert custom placeholder values to valid Next.js values
  const nextPlaceholder: "blur" | "empty" =
    placeholder === "blur-sm" ? "blur" : (placeholder as "blur" | "empty");

  return {
    src: src || FALLBACK_IMAGES[fallbackType],
    alt: alt || "Image",
    width,
    height,
    priority,
    quality: Number(quality), // Ensure quality is a number
    placeholder: nextPlaceholder,
    blurDataURL: nextPlaceholder === "blur" ? blurDataURL : undefined,
    loading: priority ? "eager" : loading,
    onError: (e: any) => {
      // Fallback to default image on error
      e.target.src = FALLBACK_IMAGES[fallbackType];
    },
  };
}

/**
 * Generate responsive image sizes for different breakpoints
 */
export function getResponsiveSizes(sizes?: string) {
  return sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
}

/**
 * Check if image source is valid
 */
export function isValidImageSrc(src: string | undefined | null): boolean {
  if (!src) return false;
  if (typeof src !== "string") return false;
  if (src.trim() === "") return false;
  return true;
}

/**
 * Get image dimensions with fallbacks
 */
export function getImageDimensions(
  width?: number,
  height?: number,
  aspectRatio: number = 16 / 9,
): { width: number; height: number } {
  if (width && height) {
    return { width, height };
  }

  if (width) {
    return { width, height: Math.round(width / aspectRatio) };
  }

  if (height) {
    return { width: Math.round(height * aspectRatio), height };
  }

  // Default dimensions
  return { width: 800, height: Math.round(800 / aspectRatio) };
}

/**
 * Create a blur data URL from an image
 */
export function createBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = "#f3f4f6",
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return DEFAULT_BLUR_DATA_URL;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.1);
}

/**
 * Image loading error handler
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackSrc?: string,
) {
  const target = event.target as HTMLImageElement;
  if (fallbackSrc && target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch preload multiple images
 */
export async function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}
