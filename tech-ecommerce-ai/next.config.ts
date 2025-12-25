import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tgdd.vn',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Fix WASM loading issues
  webpack: (config) => {
    // Disable WASM warnings
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { message: /Failed to parse source map/ },
    ]

    // Handle WASM files properly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    }

    // Prevent WASM from being processed incorrectly
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    })

    return config
  },
  // Output configuration to prevent WASM issues
  outputFileTracingRoot: undefined,
  outputFileTracingIncludes: {},
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  },
}

export default nextConfig
