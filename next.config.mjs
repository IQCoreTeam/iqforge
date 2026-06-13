/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    // web3.js / bonfida expect Node globals in the browser bundle.
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false, os: false, crypto: false };
    config.plugins.push(
      new webpack.ProvidePlugin({ Buffer: ["buffer", "Buffer"], process: "process/browser" }),
    );
    return config;
  },
};
export default nextConfig;
