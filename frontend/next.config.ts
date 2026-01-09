import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Development backend (localhost)
      { protocol: "http", hostname: "localhost", port: "8080" },
      { protocol: "http", hostname: "127.0.0.1", port: "8080" },
      // Production/Staging backends
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.s3.amazonaws.com" },
      { protocol: "https", hostname: "**.s3.**.amazonaws.com" },
      // MinIO (if used)
      { protocol: "http", hostname: "localhost", port: "9000" },
      { protocol: "https", hostname: "**.minio.**" },
      // Placeholder services
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "example.com" },
    ],
    // Thêm domain cho next/image
    domains: [
      "ui-avatars.com",
      // Nếu có domain khác, thêm ở đây
    ],
    // Allow unoptimized images for development (optional, can remove in production)
    unoptimized: process.env.NODE_ENV === "development" ? false : false,
  },

  // Performance optimizations
  reactStrictMode: true,

  // Optimize page transitions
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  /* config options here */
};

export default nextConfig;
