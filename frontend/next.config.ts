import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Removed turbopack root: '..' to prevent watching the entire project directory
  // which was causing slow compilation and infinite loops.
  // Next.js will now only watch the frontend directory.

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
