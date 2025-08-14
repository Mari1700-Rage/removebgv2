import { Metadata } from "next";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Image Details - AI Background Remover",
  description: "View and edit your processed image",
};

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}
interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params: { id } }: Props) {
  // Defensive check if needed
  if (typeof id !== 'string') {
    throw new Error("Invalid ID");
  }

  return (
    <div>
      <h1>Image Details</h1>
      <p>Client-side data for ID: {id}</p>
    </div>
  );
}
