/** @type {import('next').NextConfig} */
const nextConfig = {
  //TODO: see if rainbowKit has fixed account popup close button and change reactStrictMode to true
  reactStrictMode: false,
  images: {
    disableStaticImages: true,
    domains: [],
  },
  env: {
    MINIMUM_AMOUNT_DEPOSIT: 1,
  },
  pageExtensions: ["page.tsx", "ts"],
};

module.exports = nextConfig;
