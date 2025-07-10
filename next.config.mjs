import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'export',
    trailingSlash: true,
    distDir: 'dist',
    images: {
        unoptimized: true,
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/**',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        config.resolve = {
            ...config.resolve,
            alias: {
                ...config.resolve.alias,
                "sharp$": false,
                "onnxruntime-node$": false,
            },
            fallback: {
                "fs": false,
                "path": false,
                "crypto": false
            }
        };

        config.module.rules.push({
            test: /\.m?js$/,
            type: "javascript/auto",
            resolve: {
                fullySpecified: false
            }
        });

        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
            topLevelAwait: true,
            syncWebAssembly: true
        };

        return config;
    }
};

export default nextConfig;
