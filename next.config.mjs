/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable static image optimization for SSG
    unoptimized: false,

    // Configure image formats for optimization
    formats: ["image/webp", "image/avif"],

    // Configure image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Allow remote image patterns if needed
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "**/**",
      },
    ],

    // Configure image domains for optimization
    domains: [],

    // Enable image optimization during build for SSG
    loader: "default",

    // Configure minimum cache TTL
    minimumCacheTTL: 31536000, // 1 year
  },

  // Enable static export if needed for SSG
  // output: 'export',
  // trailingSlash: true,

  // Configure experimental features for better image handling
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
