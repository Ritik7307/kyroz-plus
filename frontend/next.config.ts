import type { NextConfig } from "next";
// @ts-expect-error next-pwa does not have types
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

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
  turbopack: {},
};

export default withPWA(nextConfig);
