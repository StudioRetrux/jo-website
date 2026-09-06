import type { NextConfig } from "next";

const IMMUTABLE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  reactCompiler: true,
  // Files under public/ ship with max-age=0. The icon/share set and the OG font never
  // change in place — a new key visual gets a new filename — so they can be cached hard.
  // Anything under app/ (favicon.ico, icon.svg, opengraph-image) is hashed by Next already.
  async headers() {
    return [
      {
        source: "/:file(icon-.*\\.png|og-image.*\\.(?:jpg|png)|twitter-card.*\\.jpg)",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
    ];
  },
};

export default nextConfig;
