/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: false,
  env: {
    BASE_URL: process.env.BASE_URL || "http://backend-default",
  },
};

export default withNextIntl(nextConfig);
