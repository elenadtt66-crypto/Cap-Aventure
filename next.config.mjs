/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  devIndicators: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      }
    ],
  },
};

export default nextConfig;
