/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  eslint: {
    dirs: ['src'],
  },

  images: {
    unoptimized: true,
  },

  reactStrictMode: true,
  swcMinify: true,

  output: 'export',
};

export default nextConfig;
