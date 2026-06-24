import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import os from "os";

const withNextIntl = createNextIntlPlugin();

function getLocalSubnetOrigins(): string[] {
  const origins: string[] = ["localhost", "127.0.0.1"];
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const netList = interfaces[name];
    if (!netList) continue;
    for (const net of netList) {
      if (net.family === "IPv4" && !net.internal) {
        const parts = net.address.split(".");
        if (parts.length === 4) {
          const subnetPrefix = `${parts[0]}.${parts[1]}.${parts[2]}`;
          for (let i = 1; i <= 254; i++) {
            origins.push(`${subnetPrefix}.${i}`);
            origins.push(`${subnetPrefix}.${i}:3000`);
          }
        }
        origins.push(net.address);
        origins.push(`${net.address}:3000`);
      }
    }
  }
  return origins;
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalSubnetOrigins(),
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default withNextIntl(nextConfig);

