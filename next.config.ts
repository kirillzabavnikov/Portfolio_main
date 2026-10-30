import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  experimental: { useTypeScriptCli: false },
  trailingSlash: true,
  images: { unoptimized: true },
};
export default config;
