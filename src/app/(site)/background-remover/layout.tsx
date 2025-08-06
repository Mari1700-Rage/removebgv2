import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Background Remover Tool | Remove Image Backgrounds Instantly | Eraseto",
  description: "Remove image backgrounds with our powerful AI tool. Get precise cutouts with transparent backgrounds in seconds. Perfect for product photos, portraits, and more.",
  keywords: "background remover, remove background, transparent background, image editing, AI background removal, photo editor, PNG converter, transparent PNG",
  alternates: {
    canonical: "https://eraseto.com/background-remover",
  },
  openGraph: {
    title: "Free Online Background Remover Tool | Eraseto",
    description: "Remove image backgrounds instantly with our AI-powered tool. No signup required.",
    url: "https://eraseto.com/background-remover",
    images: [
      {
        url: "/og-image-background-remover.jpg",
        width: 1200,
        height: 630,
        alt: "Eraseto - Background Remover Tool",
      },
    ],
  },
};

export default function BackgroundRemoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 