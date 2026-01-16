/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@keel/ui', '@keel/api-client'],
  experimental: {
    optimizePackageImports: ['@keel/ui'],
  },
};

module.exports = nextConfig;
