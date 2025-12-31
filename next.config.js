/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ["https://*.cluster-qxqlf3vb3nbf2r42l5qfoebdry.cloudworkstations.dev"],
  },
};

module.exports = nextConfig;
