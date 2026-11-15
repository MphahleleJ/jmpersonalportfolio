import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "junemphahlele.co.za" }],
        destination: "https://www.junemphahlele.co.za/:path*",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;