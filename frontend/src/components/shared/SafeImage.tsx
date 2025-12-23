"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  fallbackSrc = "/images/lesson_thum.png", // Use existing placeholder
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // If fill is true, use fill layout
  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        priority={priority}
        unoptimized={imgSrc.startsWith("http")} // Disable optimization for external URLs
      />
    );
  }

  // Otherwise use width/height
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      onError={handleError}
      priority={priority}
      unoptimized={imgSrc.startsWith("http")} // Disable optimization for external URLs
    />
  );
}

