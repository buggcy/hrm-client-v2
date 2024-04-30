/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  output: 'export',
};

export default nextConfig;
