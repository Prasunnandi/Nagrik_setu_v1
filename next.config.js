/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',   // required for Cloud Run / Docker
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  images: {
    domains: ['lh3.googleusercontent.com', 'maps.gstatic.com'],
    unoptimized: true,
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};
module.exports = nextConfig;
