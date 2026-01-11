import Image, { ImageProps } from "next/image";
import React from "react";

export interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string;
  fallback?: string;
}

export const SafeImage = React.forwardRef<HTMLImageElement, SafeImageProps>(
  ({ src, fallback = "/images/lesson_thum.png", ...props }, ref) => {
    const [imgSrc, setImgSrc] = React.useState(src || fallback);
    React.useEffect(() => {
      setImgSrc(src || fallback);
    }, [src, fallback]);
    return (
      <Image
        {...props}
        ref={ref as any}
        src={imgSrc || fallback}
        onError={() => setImgSrc(fallback)}
      />
    );
  }
);
SafeImage.displayName = "SafeImage";
