import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Keep images optimised via Next.js default pipeline
    unoptimized: false,
  },
};

export default nextConfig;
