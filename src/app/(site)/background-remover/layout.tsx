import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Background Remover Tool | Remove Image Backgrounds Instantly | Eraseto",
  description:
    "Remove image backgrounds with our powerful AI tool. Get precise cutouts with transparent backgrounds in seconds. Perfect for product photos, portraits, and more.",
  keywords:
    "background remover, remove background, transparent background, image editing, AI background removal, photo editor, PNG converter, transparent PNG",
  alternates: {
    canonical: "https://eraseto.com/background-remover",
  },
  openGraph: {
    title: "Free Online Background Remover Tool | Eraseto",
    description:
      "Remove image backgrounds instantly with our AI-powered tool. No signup required.",
    url: "https://eraseto.com/background-remover",
    siteName: "eraseto",
    images: [
      {
        url: "https://eraseto.com/og-image-background-remover.jpg", // use full URL to avoid misloading
        width: 1200,
        height: 630,
        alt: "Eraseto - Background Remover Tool",
        type: "image/jpeg",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Background Remover Tool | Eraseto",
    description:
      "Remove image backgrounds instantly with our AI-powered tool. No signup required.",
    images: ["https://eraseto.com/og-image-background-remover.jpg"],
    site: "@Eraseto", // change if you have an official Twitter handle
  },
};

export default function BackgroundRemoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
