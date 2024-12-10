import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['metaschool.so'],
  },
  eslint: {
      ignoreDuringBuilds: true,
    },
};

export default nextConfig;
