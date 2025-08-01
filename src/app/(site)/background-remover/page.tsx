"use client";

import { useState, useEffect, useRef } from "react";

export default function BackgroundRemoverPage() {
  const [pipeline, setPipeline] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load the Hugging Face pipeline dynamically on client
  useEffect(() => {
    (async () => {
      try {
        const { pipeline } = await import("@huggingface/transformers");
        const bgRemoval = await pipeline("image-segmentation", "briaai/RMBG-1.4");
        setPipeline(() => bgRemoval);
      } catch (e) {
        console.error("Failed to load HF pipeline:", e);
        setError("Failed to load background removal model.");
      }
    })();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResultImage(null);
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    if (!pipeline) {
      setError("Model is not loaded yet. Please wait.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result !== "string") {
        setError("Failed to read the image file.");
        setLoading(false);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous"; // prevent CORS issues
      img.src = reader.result;

      img.onload = async () => {
        try {
          const segmentation = await pipeline(reader.result);

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
            setError("Canvas context error.");
            setLoading(false);
            return;
          }

          ctx.drawImage(img, 0, 0);

          const mask = segmentation[0].mask;
          const maskWidth = segmentation[0].width;
          const maskHeight = segmentation[0].height;

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Scale mask to canvas size, make background transparent
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

          const resultURL = canvas.toDataURL("image/png");
          setResultImage(resultURL);
        } catch (e) {
          console.error("Segmentation failed:", e);
          setError("Background removal failed.");
        }
        setLoading(false);
      };

      img.onerror = () => {
        setError("Failed to load the image.");
        setLoading(false);
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow text-center">
      <label className="block mb-4 cursor-pointer text-gray-700 font-medium">
        Select an image to remove background:
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:text-gray-700 hover:file:bg-gray-100"
        />
      </label>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {loading && <p className="text-blue-600">Removing background...</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}

      {resultImage && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Result:</p>
          <img src={resultImage} alt="Background removed" className="rounded shadow max-w-full h-auto mx-auto" />
        </div>
      )}
    </div>
  );
}
