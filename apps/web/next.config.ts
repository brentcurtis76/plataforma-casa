import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js'],
  // Ensure proper server binding
  poweredByHeader: false,
};

export default nextConfig;
