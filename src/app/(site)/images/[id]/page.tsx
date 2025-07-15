// File: src/app/(site)/images/[id]/page.tsx
import type { Metadata } from "next";

// Metadata is fine
export const metadata: Metadata = {
  title: "Image Details - AI Background Remover",
  description: "View and edit your processed image",
};

// This helps Next.js pre-render the route statically for "placeholder"
export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

// Props definition — correct
interface Props {
  params: {
    id: string;
  };
}

// ✅ Component name should be capitalized: "Page", not "page"
export default function Page({ params: { id } }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Image Details</h1>
      <p>This page will be populated with client-side data for ID: {id}</p>
    </div>
  );
}
