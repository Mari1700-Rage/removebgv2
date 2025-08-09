import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'next/dist/compiled/webpack/webpack-lib.js'; // ✅ Needed for ContextReplacementPlugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self';",
      "script-src 'self' https://eraseto.com https://pagead2.googlesyndication.com https://www.googletagservices.com https://securepubads.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google;",
      "style-src 'self' https://fonts.googleapis.com;", // Remove 'unsafe-inline' if possible
      "img-src 'self' data: blob: https://eraseto.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google;",
      "connect-src 'self' https://eraseto.com https://huggingface.co https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google;",
      "font-src 'self' https://fonts.gstatic.com;",
      "frame-src 'self' https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google;",
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
    value: 'DENY', // Change to SAMEORIGIN if iframe embedding is needed
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block', // Deprecated in some browsers, still useful in others
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
  webpack: (config, { isServer }) => {
    // Removed devtool override to avoid errors

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        sharp$: false,
        'onnxruntime-node$': false,
        'onnxruntime-web/dist/ort.node.min.mjs': false,
      },
      fallback: {
        ...config.resolve.fallback,
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

    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /onnxruntime-web[\\/]dist/,
        path.resolve('./node_modules/onnxruntime-web/dist')
      )
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
