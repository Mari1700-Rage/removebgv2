"use client";

import { useState, useCallback } from "react";

export default function DropZone() {
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("API failed");

      const blob = await res.blob();
      const objectURL = URL.createObjectURL(blob);
      setResultImage(objectURL);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" onChange={onFileChange} />

      {loading && <p>Removing background...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {resultImage && (
        <div className="mt-4">
          <img src={resultImage} alt="Result" className="max-w-full border rounded" />
          <a href={resultImage} download="no-bg.png" className="mt-2 inline-block text-blue-500 underline">
            Download
          </a>
        </div>
      )}
    </div>
  );
}
