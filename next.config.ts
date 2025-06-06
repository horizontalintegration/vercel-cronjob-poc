import { NextConfig as NextConfigType } from "next";

const nextConfig: NextConfigType = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent bundling native modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
