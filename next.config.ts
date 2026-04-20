import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets-bucket.deadlock-api.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.deadlock-api.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
