import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.umuhinzi-backend.echo-solution.com',
        pathname: '/api/v1/public/**',
      },
      // If you also want to allow https for the same hostname
      {
        protocol: 'https',
        hostname: 'api.umuhinzi-backend.echo-solution.com',
        pathname: '/api/v1/public/**',
      },
    ],
  },
};

export default nextConfig;
