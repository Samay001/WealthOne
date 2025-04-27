import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      }
    ],
    domains: ['images.pexels.com','framerusercontent.com','upload.wikimedia.org','seeklogo.com','logowik.com'],
  }
};

export default nextConfig;
