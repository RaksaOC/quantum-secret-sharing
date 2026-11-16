import type { NextConfig } from "next";

/* The browser only ever calls /api/*. Next proxies it to FastAPI, so there is no CORS
   and the backend URL lives in one place. Rewrites are baked in at build time, so the
   Docker image takes API_URL as a build arg (docker-compose sets http://backend:8000). */
const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000";

const config: NextConfig = {
  poweredByHeader: false,
  output: "standalone", // small self-contained server for the Docker image
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default config;
