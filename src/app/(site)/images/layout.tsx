import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Processed Images | Background Removed Photos | Eraseto",
  description: "View and download your processed images with backgrounds removed. High-quality transparent PNG files ready for use.",
  keywords: "processed images, background removed photos, transparent PNG downloads, edited images",
  alternates: {
    canonical: "https://eraseto.com/images",
  },
  openGraph: {
    title: "Your Processed Images | Eraseto",
    description: "View and download your background-removed images in high quality.",
    url: "https://eraseto.com/images",
    images: [
      {
        url: "/og-image-images.jpg",
        width: 1200,
        height: 630,
        alt: "Eraseto - Your Processed Images",
      },
    ],
  },
};

export default function ImagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} (
    <html lang="en">
      <head>
        {/* Google AdSense Script */}
         <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4619589162374260"
     crossorigin="anonymous"></script>
        />
      </head>
      <body>
        {/* Optional: You could wrap the layout if you need a container */}
        {children}
      </body>
    </html>
  );
}
