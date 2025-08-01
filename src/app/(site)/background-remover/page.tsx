"use client";

import React, { useState, useRef } from "react";
import { pipeline } from "@huggingface/transformers";

export default function BackgroundRemover() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const removeBackground = async (file: File) => {
    setLoading(true);

    try {
      const bgRemoval = await pipeline("image-segmentation", "briaai/RMBG-1.4");

      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          const img = new Image();
          img.crossOrigin = "anonymous"; // Avoid CORS issues
          img.src = reader.result;

          img.onload = async () => {
            // Run segmentation on the data URL image
            const segmentation = await bgRemoval(reader.result);

            /*
              segmentation output looks like:
              [
                {
                  label: "foreground",
                  mask: [0,1,1,0,...] // binary or float mask array flattened
                  width: number,
                  height: number,
                  // sometimes probability mask per pixel
                }
              ]
            */

            // Prepare canvas
            const canvas = canvasRef.current!;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);

            // Extract mask info from segmentation result
            const maskData = segmentation[0].mask;
            const maskWidth = segmentation[0].width;
            const maskHeight = segmentation[0].height;

            // Get image data to modify alpha channel
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Resize or scale mask to image size if necessary
            // (Assuming mask and image sizes are equal here; if not, you may need to scale)

            // Apply mask: make background pixels transparent
            for (let y = 0; y < maskHeight; y++) {
              for (let x = 0; x < maskWidth; x++) {
                const maskIndex = y * maskWidth + x;
                const alphaIndex = (y * canvas.width + x) * 4 + 3;

                // If mask pixel is background (0), set alpha to 0 (transparent)
                // If mask pixel is foreground (1), keep alpha 255 (opaque)
                if (maskData[maskIndex] < 0.5) {
                  data[alphaIndex] = 0;
                }
              }
            }

            ctx.putImageData(imageData, 0, 0);

            // Convert canvas to image URL
            const outputUrl = canvas.toDataURL("image/png");
            setResultUrl(outputUrl);
            setLoading(false);
          };
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error removing background:", error);
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      removeBackground(e.target.files[0]);
    }
  };

  return (
    <div>
      <h1>Background Remover with Hugging Face RMBG-1.4</h1>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {loading && <p>Removing background...</p>}
      {resultUrl && (
        <div>
          <h2>Result</h2>
          <img src={resultUrl} alt="Result" style={{ maxWidth: "400px" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}
    </div>
  );
}
