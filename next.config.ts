import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bala-game-images.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/balance-game/**",
      },
    ],
  },
};

export default nextConfig;
