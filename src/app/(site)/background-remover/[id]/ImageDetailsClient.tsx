"use client";

import { useEffect } from "react";

export default function ImageDetailsClient({ id }: { id: string }) {
  useEffect(() => {
    // You can safely use onnxruntime, window, document, etc. here
    console.log("Running background remover for ID:", id);
  }, [id]);

  return (
    <div>
      <p className="text-gray-600">Processing image: <strong>{id}</strong></p>
      {/* Your DropZone, canvas, etc. here */}
    </div>
  );
}
