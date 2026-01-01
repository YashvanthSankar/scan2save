import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  // Enable compression for faster responses
  compress: true,

  // Image optimization for external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
  },

  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Turbopack for fast dev builds
  turbopack: {} as any,
};

export default withPWA(nextConfig);
