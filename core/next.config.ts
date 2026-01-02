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

  // OPTIMIZATION: Expanded package imports for better tree-shaking
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
      'firebase',
      'firebase-admin',
    ],
    // Cache static pages in client-side router cache for faster navigation
    staleTimes: {
      dynamic: 30, // Dynamic pages cached for 30 seconds
      static: 180, // Static pages cached for 3 minutes
    },
  },

  // Turbopack for fast dev builds
  turbopack: {} as any,
};

export default withPWA(nextConfig);
