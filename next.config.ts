import type { NextConfig } from "next";
import path from "node:path";
import { execSync } from "node:child_process";

const GIT_HASH = execSync("git rev-parse --short HEAD").toString().trim();

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias["yjs"] = path.resolve(__dirname, "node_modules/yjs");
    }
    return config;
  },
  serverExternalPackages: ["surrealdb"],
  output: "standalone",
  experimental: {
    ppr: true,
    dynamicIO: true,
  },
  env: {
    NEXT_PUBLIC_GIT_HASH: GIT_HASH,
  },
};

export default nextConfig;
