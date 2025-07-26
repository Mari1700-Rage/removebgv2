import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' https://pagead2.googlesyndication.com https://www.googletagservices.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src * data:",
      "connect-src *",
      "frame-src https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com",
      "child-src https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com"
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
  async rewrites() {
    return [
      {
        source: '/ads.txt',
        destination: '/ads.txt',
      },
    ];
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
