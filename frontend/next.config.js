/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@keel/ui', '@keel/api-client'],
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@keel/ui'],
  },
};

module.exports = nextConfig;
