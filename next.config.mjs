/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack }) => {
    // Solana/IQLabs SDKs expect the Node `Buffer` global in the browser.
    config.plugins.push(
      new webpack.ProvidePlugin({ Buffer: ["buffer", "Buffer"] }),
    );
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false, os: false };
    // git-sdk is multichain; its EVM adapter (+ethers) is an optional peer we
    // never call (we run chain:"solana"). Stub the module out of the bundle.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@iqlabs-official/ethereum-sdk": false,
      ethers: false,
    };
    return config;
  },
};
export default nextConfig;
