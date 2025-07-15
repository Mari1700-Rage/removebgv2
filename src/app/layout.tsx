import { cn } from "@/lib/utils";
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./Providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AI Background Remover | Free Online Background Eraser Tool | Eraseto",
  description: "Remove image backgrounds instantly with Eraseto's AI Background Remover. Get perfect transparent PNG images for free in one click. No signup required.",
  keywords: "background remover, remove background, transparent background, image editing, AI background removal, photo editor, PNG converter, transparent PNG",
  creator: "WEB PROJECT SOLUTIONS LTD",
  metadataBase: new URL("https://eraseto.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eraseto.com",
    title: "Free AI Background Remover | Eraseto",
    description: "Remove backgrounds from images in seconds with our AI-powered tool. Free, fast, and no signup required.",
    siteName: "Eraseto Background Remover",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eraseto - AI Background Remover Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Background Remover | Eraseto",
    description: "Remove backgrounds from images instantly with our AI-powered tool. Free, fast, and no signup required.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://eraseto.com",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  minimumScale: 1,
  initialScale: 1,
  userScalable: false
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="google-site-verification" content="your-verification-code" />
        
        {/* Google AdSense Script */}
        <Script
         async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4619589162374260"
     crossorigin="anonymous"
        />
      </head>
      <body className={cn(
        "min-h-dvh bg-background antialiased",
        GeistSans.className
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
