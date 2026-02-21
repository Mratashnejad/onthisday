import type { NextConfig } from "next";
import path from "node:path";

const appRoot = process.cwd();
const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
  webpack: (config) => {
    const frontendNodeModules = path.join(appRoot, "node_modules");

    config.resolve = config.resolve ?? {};
    config.resolve.modules = [
      frontendNodeModules,
      ...(config.resolve.modules ?? []),
    ];

    return config;
  },
};

export default nextConfig;
