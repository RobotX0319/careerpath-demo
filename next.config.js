/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'api.dicebear.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    // Optimize images on demand
    optimizeImages: true,
    // Enable rust-based minifier for faster builds
    swcTraceProfiling: true,
    // Reduce JS bundle size
    modularizeImports: {
      'lodash-es': {
        transform: 'lodash-es/{{member}}',
      },
      '@mui/material': {
        transform: '@mui/material/{{member}}',
      },
      '@mui/icons-material': {
        transform: '@mui/icons-material/{{member}}',
      },
    },
  },
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable app directory and Server Components
  typescript: {
    // Faster TypeScript checking
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
};

module.exports = withPWA(nextConfig);