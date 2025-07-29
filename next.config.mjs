import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false, // or keep true if you're sure
  images: {
    unoptimized: true,
    domains: ['eraseto.com'], // UPDATE this!
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        sharp$: false,
        'onnxruntime-node$': false,
      },
      fallback: {
        fs: false,
        path: false,
        crypto: false,
      },
    };

    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
      syncWebAssembly: true,
    };

    return config;
  },
};

export default nextConfig;
