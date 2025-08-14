// app/background-remover/[id]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";

// Ensure this runs at runtime and accepts any id
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Image Details - AI Background Remover",
  description: "View and edit your processed image",
};

interface Props {
  params: {
    id: string | string[]; // defensive typing
  };
}

export default function Page({ params }: Props) {
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (typeof rawId !== "string" || !rawId.trim()) {
    notFound();
  }

  const id = rawId; // Guaranteed string

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Image Details</h1>
      <p>This page is rendered dynamically for ID: {id}</p>
    </div>
  );
}
