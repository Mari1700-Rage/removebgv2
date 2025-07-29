import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** 
 * Generate a base64 nonce string per request.
 * You can tweak length if desired.
 */
function generateNonce() {
  return crypto.randomBytes(16).toString('base64');
}

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
        headers: [
          // We will dynamically generate nonce for each request inside middleware or server.
          // For static config here, we provide a placeholder which will be replaced in middleware.
          {
            key: 'Content-Security-Policy',
            value: (req) => {
              // Generate nonce per request
              const nonce = generateNonce();
              
              // Save nonce on request to inject it in React components if needed (optional)
              req.nonce = nonce;

              // Build CSP header string with nonce and strict-dynamic
              return [
                `default-src 'self'`,
                `script-src 'nonce-${nonce}' 'strict-dynamic' https: http:`,
                `style-src 'self' 'nonce-${nonce}'`, // if you want to protect inline styles with nonce
                `img-src * data:`,
                `connect-src * https://ep2.adtrafficquality.google`,
                `worker-src 'self' blob:`,
                `frame-src https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com`,
                `child-src https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com`,
                `object-src 'none'`,
                `base-uri 'none'`,
              ].join('; ');
            },
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
        ],
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'cheap-module-source-map'; // CSP safe devtool
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
