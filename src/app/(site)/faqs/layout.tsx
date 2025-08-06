import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Background Remover Tool | Eraseto",
  description: "Get answers to common questions about our AI background removal tool. Learn how to use Eraseto effectively for your image editing needs.",
  keywords: "background remover FAQ, image editing questions, AI background removal help, transparent background guide",
  alternates: {
    canonical: "https://eraseto.com/faqs",
  },
  openGraph: {
    title: "Background Remover FAQs | Eraseto",
    description: "Find answers to frequently asked questions about our AI background removal tool.",
    url: "https://eraseto.com/faqs",
    images: [
      {
        url: "/og-image-faqs.jpg",
        width: 1200,
        height: 630,
        alt: "Eraseto - Background Remover FAQs",
      },
    ],
  },
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 