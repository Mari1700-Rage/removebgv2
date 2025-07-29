import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self' https://eraseto.com",
      "script-src 'self' https://eraseto.com https://pagead2.googlesyndication.com https://www.googletagservices.com https://ep2.adtrafficquality.google 'unsafe-inline'",
      "style-src 'self' https://eraseto.com 'unsafe-inline'",
      "img-src 'self' https://eraseto.com data: https://*",
      "connect-src 'self' https://eraseto.com https://* blob: data:",
      "worker-src 'self' blob:",
      "frame-src https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com",
      "child-src https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com",
      "script-src-attr 'none'",
      "object-src 'none'",
      "base-uri 'none'"
    ].join('; ')
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    unoptimized: true,
    domains: ['eraseto.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'cheap-module-source-map';
    }

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

    config.module.rules.push(
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /ort\.node\.min\.mjs$/,
        parser: {
          amd: false,
          commonjs: false,
        },
      }
    );

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
