/**
 * Bundle Analyzer Configuration
 * 
 * This file enables the bundle analyzer visualization
 * Run with: npm run analyze
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
    optimizeImages: true,
    swcTraceProfiling: true,
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
    removeConsole: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // Add performance budget warnings in development
    if (dev) {
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 400000,
        maxAssetSize: 400000,
      };
    }

    // Optimize CSS
    if (!dev && !isServer) {
      // Enable Critters for CSS inlining
      config.optimization.minimizer.push(
        new CrittersPlugin({
          preload: 'media',
          pruneSource: true,
          compress: true,
          logLevel: 'silent',
        })
      );
      
      // Compress assets
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }
    
    return config;
  },
};

// Need to require here to avoid errors during build when not using analyze
const CrittersPlugin = process.env.ANALYZE === 'true' ? require('critters') : null;
const CompressionPlugin = process.env.ANALYZE === 'true' ? require('compression-webpack-plugin') : null;

// Apply both bundle analyzer and PWA
module.exports = withBundleAnalyzer(withPWA(nextConfig));