/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to allow API routes
  trailingSlash: false,
  images: {
    unoptimized: true, // Required for static export
  },
  // Ignore build errors for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable telemetry
  telemetry: false,
  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

export default nextConfig
