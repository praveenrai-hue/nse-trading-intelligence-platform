import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  cacheComponents: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
