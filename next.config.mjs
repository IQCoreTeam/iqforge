/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack }) => {
    // Solana/IQLabs SDKs expect the Node `Buffer` global in the browser.
    config.plugins.push(
      new webpack.ProvidePlugin({ Buffer: ["buffer", "Buffer"] }),
    );
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false, os: false };
    return config;
  },
};
export default nextConfig;
