// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig

/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: false,
  env: {
    BASE_URL: process.env.BASE_URL || "http://backend-default",
  },

  // async rewrites() {
  // 	// Ensure BASE_URL is defined with a fallback
  // 	const baseUrl = process.env.BASE_URL || "http://backend-default"
  // 	return [
  // 		{
  // 			source: "/app-service/:path*",
  // 			destination: `${baseUrl}/:path*`
  // 		}
  // 	]
  // }
};

export default withNextIntl(nextConfig);
