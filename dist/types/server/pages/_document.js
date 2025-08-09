import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* ✅ Google AdSense Script */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4619589162374260"
            crossOrigin="anonymous"
          ></script>

          {/* ✅ Google Site Verification Meta Tag */}
          <meta name="google-adsense-account" content="ca-pub-4619589162374260" />

          {/* ✅ Meta tags for rendering and SEO */}
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
