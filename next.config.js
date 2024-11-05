/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-balansome.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/balance-game/**",
      },
      {
        protocol: "https",
        hostname: "bala-game-images.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/balance-game/**",
      },
    ],
  },
};

module.exports = nextConfig;
