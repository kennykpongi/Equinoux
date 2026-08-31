import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The immersive /studio experience was retired; case studies now live
      // at /work/*. Preserve any old /studio/work/* links.
      { source: "/studio/work/:slug", destination: "/work/:slug", permanent: true },
      // /studio used to 308 to the homepage. The About page now lives at
      // /about — a path that has never been redirected, so no browser is
      // holding a stale permanent redirect for it — and /studio points there.
      { source: "/studio", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
