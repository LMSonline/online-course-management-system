"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  onError?: () => void;
}

/**
 * SafeImage component that handles broken/missing image URLs gracefully.
 * 
 * Features:
 * - Falls back to placeholder if src is empty/null/undefined
 * - Handles image load errors with fallback
 * - Supports both Next.js Image and regular img tag
 * - Validates URLs before rendering
 * 
 * Usage:
 * <SafeImage
 *   src={course.thumbnailUrl}
 *   alt={course.title}
 *   fallback="/images/lesson_thum.png"
 *   fill
 *   className="object-cover"
 * />
 */
export function SafeImage({
  src,
  alt,
  fallback = "/images/lesson_thum.png",
  className,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  objectFit = "cover",
  onError,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(fallback);
  const [hasError, setHasError] = useState(false);

  // Normalize and validate src
  useEffect(() => {
    if (!src || src.trim() === "" || src === "null" || src === "undefined") {
      setImgSrc(fallback);
      setHasError(false);
      return;
    }

    // If src is a relative path starting with /, it's a local image
    if (src.startsWith("/")) {
      setImgSrc(src);
      setHasError(false);
      return;
    }

    // If src is a full URL, validate it
    try {
      const url = new URL(src);
      // If URL is valid, use it
      setImgSrc(src);
      setHasError(false);
    } catch {
      // Invalid URL, use fallback
      setImgSrc(fallback);
      setHasError(false);
    }
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
      onError?.();
    }
  };

  // If using fill, use Next.js Image with fill
  if (fill) {
    return (
      <div className={cn("relative", className)}>
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, 33vw"}
          className={cn(
            `object-${objectFit}`,
            hasError && "opacity-50"
          )}
          priority={priority}
          onError={handleError}
          unoptimized={imgSrc.startsWith("http://localhost") || imgSrc.startsWith("http://127.0.0.1")}
        />
        {hasError && imgSrc === fallback && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
            <ImageIcon className="w-8 h-8 text-slate-400" />
          </div>
        )}
      </div>
    );
  }

  // If width/height provided, use Next.js Image with dimensions
  if (width && height) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          className,
          `object-${objectFit}`,
          hasError && "opacity-50"
        )}
        priority={priority}
        onError={handleError}
        unoptimized={imgSrc.startsWith("http://localhost") || imgSrc.startsWith("http://127.0.0.1")}
      />
    );
  }

  // Fallback to regular img tag if dimensions not provided and fill is false
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn(
        className,
        `object-${objectFit}`,
        hasError && "opacity-50"
      )}
      onError={handleError}
    />
  );
}

