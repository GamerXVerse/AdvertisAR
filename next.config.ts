import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  devIndicators: false,
  turbopack: { root: process.cwd() },
  async rewrites() {
    const api = process.env.API_ORIGIN ?? (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "");
    return api ? [{ source: "/api/:path*", destination: `${api}/api/:path*` }] : [];
  },
};

export default config;
