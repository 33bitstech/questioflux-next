import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb',
    },
  },
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quizvortex33.s3.sa-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'quizvortex.s3.sa-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ]
  }
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
