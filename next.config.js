/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================================
  // Build Configuration
  // ============================================================================
  
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // Powered by header (disable for security)
  poweredByHeader: false,
  
  // TypeScript configuration
  typescript: {
    // Set to false for production to catch type errors
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // ESLint configuration
  eslint: {
    // Set to false for production to catch lint errors
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  
  // ============================================================================
  // Image Optimization
  // ============================================================================
  
  images: {
    // Remote image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Image formats
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for next/image
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize image size
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // ============================================================================
  // Security Headers
  // ============================================================================
  
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: *.supabase.co",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Strict Transport Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  
  // ============================================================================
  // Redirects
  // ============================================================================
  
  async redirects() {
    return [
      // Redirect /home to /
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Redirect old paths if needed
      {
        source: '/dashboard',
        destination: '/cases',
        permanent: true,
      },
    ];
  },
  
  // ============================================================================
  // Experimental Features
  // ============================================================================
  
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // ============================================================================
  // Webpack Configuration
  // ============================================================================
  
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // ============================================================================
  // Environment Variables
  // ============================================================================
  
  env: {
    // Expose build-time environment variables
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};

module.exports = nextConfig;
