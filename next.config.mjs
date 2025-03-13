/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['plus.unsplash.com', 'images.unsplash.com','unsplash.com','img.daisyui.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Correct pattern for unsplash images
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // This covers specific subdomains of Unsplash
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google images
      },
    ],
    // remotePatterns: [
    //   { hostname: 'plus.unsplash.com' },
    //   { hostname: 'lh3.googleusercontent.com' },
    //   { hostname: 'https://unsplash.com' },
    // ],
  },
  // experimental: {
  //   serverActions: true,
  // },
};

export default nextConfig;
