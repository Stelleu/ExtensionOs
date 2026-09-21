import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid CSRF / origin mismatches on Netlify when Server Actions POST.
  experimental: {
    serverActions: {
      allowedOrigins: [
        "comfy-crumble-9fdea1.netlify.app",
        "*.netlify.app",
        "extensionos.fr",
        "www.extensionos.fr",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
