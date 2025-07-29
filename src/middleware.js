import { NextResponse } from 'next/server';
import crypto from 'crypto';

export function middleware(req) {
  const nonce = crypto.randomBytes(16).toString('base64');

  const csp = [
    `default-src 'self'`,
    `script-src 'nonce-${nonce}' 'strict-dynamic' https: http:`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src * data:`,
    `connect-src * https://ep2.adtrafficquality.google`,
    `worker-src 'self' blob:`,
    `frame-src https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com`,
    `child-src https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com`,
    `object-src 'none'`,
    `base-uri 'none'`,
  ].join('; ');

  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', csp);

  // Optionally pass nonce to your app via cookie or header:
  res.headers.set('X-CSP-Nonce', nonce);

  return res;
}
