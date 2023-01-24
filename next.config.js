/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
    domains: [],
  },
  env: {
    MINIMUM_AMOUNT_DEPOSIT: 1
  },
  pageExtensions: ["page.tsx", "ts"],
};

module.exports = nextConfig;
