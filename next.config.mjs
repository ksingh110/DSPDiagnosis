/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper static file handling for Netlify
  trailingSlash: false,
  output: 'standalone', // Better for Netlify
}

export default nextConfig
