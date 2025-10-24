import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**.spotifycdn.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: '**.scdn.co',
            port: '',
            pathname: '/**',
          }
        ],
      },
};

export default nextConfig;
