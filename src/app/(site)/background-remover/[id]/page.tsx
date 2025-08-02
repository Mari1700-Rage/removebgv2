import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Details - AI Background Remover",
  description: "View and edit your processed image",
};

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

// ✅ Page expects a `params` prop with an `id` field (string)
type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Image Details</h1>
      <p>This page will be populated with client-side data for ID: {params.id}</p>
    </div>
  );
}
