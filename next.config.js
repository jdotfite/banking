// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',            // where sw.js and other assets go
  register: true,            // automatically register service worker
  skipWaiting: true,         // activate new service worker immediately
  disable: process.env.NODE_ENV === 'development', // don't run PWA in dev
  buildExcludes: [/app-build-manifest.json$/], // Add this line to fix the precaching error
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimize compilation
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize images
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Optimize builds
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ['lucide-react'],
  },
  
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development' 
              ? 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' 
              : 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    
    // Add optimization for CSS modules
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        styles: {
          name: 'styles',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true,
        },
      };
    }
    
    return config;
  },
};

module.exports = withPWA(nextConfig);
