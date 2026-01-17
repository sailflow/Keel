/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  transpilePackages: ['@keel/ui', '@keel/api-client'],
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@keel/ui'],
  },
};

module.exports = nextConfig;
