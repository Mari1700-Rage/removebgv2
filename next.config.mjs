import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self';",
      "script-src 'self' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com https://securepubads.g.doubleclick.net https://eraseto.com https://ep1.adtrafficquality.google https://ep1.adtrafficquality.google/getconfig/sodar?sv=200&tid=gda&tv=r20250728&st=env 'unsafe-inline';",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
      "img-src 'self' data: blob: https://eraseto.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net;",
      "connect-src 'self' https://eraseto.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google/getconfig/sodar?sv=200&tid=gda&tv=r20250728&st=env;",
      "font-src 'self' https://fonts.gstatic.com;",
      "frame-src https://www.google.com https://eraseto.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;",
      "object-src 'none';",
      "base-uri 'self';",
      "form-action 'self';"
    ].join(" ")
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
        'onnxruntime-web/dist/ort.node.min.mjs': false, // Prevent bundling Node version
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

    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /onnxruntime-web[\\/]dist[\\/]ort\.node\.min\.mjs/,
        message: /Critical dependency: require function/,
      },
    ];

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
