/** @type {import('next').NextConfig} */
const nextConfig = {
  // Default Next.js config 
  reactStrictMode: true,
  
  // Disable ESLint during build process
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Avoid static optimization for problematic routes
  staticPageGenerationTimeout: 120,
  
  // Improved configuration for WebSockets
  // Using a more compatible approach that works with SWC
  webpack: (config, { isServer, dev }) => {
    if (!isServer && dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 500, // Check for changes every 500ms
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    return config;
  },
  
  // Use relative paths for assets
  assetPrefix: '',
  
  // Ensure proper CORS headers for development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Ensure proper handling of redirects
  async rewrites() {
    return {
      beforeFiles: [
        // Handle cases where assets are requested from the wrong port
        {
          source: '/_next/:path*',
          destination: '/_next/:path*',
        },
      ],
    };
  },
  
  // Optionally increase the output trace to debug issues
  output: 'standalone',
};

module.exports = nextConfig; 