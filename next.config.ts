import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/about/page.tsx",
        destination: "/about",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

