"use client";

import { useCallback, useState, useRef } from "react";
import { pipeline } from "@huggingface/transformers";

export default function DropZone() {
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cache pipeline so you don’t reload each time
  const bgRemovalPipelineRef = useRef<any>(null);

  const handleFileDrop = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResultImage(null);
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    try {
      setLoading(true);
      if (!bgRemovalPipelineRef.current) {
        bgRemovalPipelineRef.current = await pipeline("image-segmentation", "briaai/RMBG-1.4");
      }
      const bgRemoval = bgRemovalPipelineRef.current;

      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result !== "string") {
          setError("Failed to read image file.");
          setLoading(false);
          return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous"; // Avoid CORS issues
        img.src = reader.result;

        img.onload = async () => {
          const segmentation = await bgRemoval(reader.result);
          if (!canvasRef.current) {
            setError("Canvas not available.");
            setLoading(false);
            return;
          }
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            setError("Canvas context not found.");
            setLoading(false);
            return;
          }
          ctx.drawImage(img, 0, 0);

          // segmentation[0] expected shape: { mask, width, height }
          const mask = segmentation[0].mask;
          const maskWidth = segmentation[0].width;
          const maskHeight = segmentation[0].height;

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // If mask dimensions differ from canvas, you’ll want to scale mask accordingly.
          // Here we assume they match or scale mask pixel coordinates proportionally:

          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const maskX = Math.floor((x / canvas.width) * maskWidth);
              const maskY = Math.floor((y / canvas.height) * maskHeight);
              const maskIndex = maskY * maskWidth + maskX;
              const alphaIndex = (y * canvas.width + x) * 4 + 3;

              if (mask[maskIndex] < 0.5) {
                data[alphaIndex] = 0; // transparent pixel
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);

          const outputUrl = canvas.toDataURL("image/png");
          setResultImage(outputUrl);
          setLoading(false);
        };

        img.onerror = () => {
          setError("Failed to load image.");
          setLoading(false);
        };
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error("Error:", e);
      setError("Background removal failed.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto text-center p-6 border border-gray-200 rounded-lg bg-white shadow">
      <label className="block mb-4 cursor-pointer font-medium text-sm text-gray-700">
        <span>Select an image to remove background:</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileDrop}
          className="mt-2 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
        />
      </label>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {loading && <p className="text-blue-500">Removing background...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {resultImage && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Result:</p>
          <img src={resultImage} alt="Processed" className="rounded shadow max-w-full h-auto mx-auto" />
        </div>
      )}
    </div>
  );
}
