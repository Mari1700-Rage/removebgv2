import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Mediapartners-Google*',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://eraseto.com/sitemap.xml',
  };
}
