/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
