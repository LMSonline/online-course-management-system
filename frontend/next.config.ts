import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
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
};

export default nextConfig;
