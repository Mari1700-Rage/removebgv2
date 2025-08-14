import { Metadata } from "next";
import { notFound } from "next/navigation";

// Make this route dynamically render at request time
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Image Details - AI Background Remover",
  description: "View and edit your processed image",
};

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params: { id } }: Props) {
  // Defensive check (optional)
  if (typeof id !== "string" || !id.trim()) {
    notFound(); // Show 404 page if ID is invalid
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Image Details</h1>
      <p>This page is rendered dynamically for ID: {id}</p>
    </div>
  );
}
