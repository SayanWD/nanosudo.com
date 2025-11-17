import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Fix for pdfkit font loading in Next.js
      // Ensure font files are accessible
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
