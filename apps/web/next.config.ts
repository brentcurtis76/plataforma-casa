import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js'],
  // Ensure proper server binding
  poweredByHeader: false,
  // Output configuration for Railway
  output: 'standalone',
  // Experimental features for better performance
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
