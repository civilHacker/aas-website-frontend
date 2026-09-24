import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/**`,
      ),
    ],
  },
};

export default nextConfig;
