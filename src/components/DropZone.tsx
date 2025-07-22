"use client";

import { useCallback, useState, useRef } from "react";
import * as ort from "onnxruntime-web";

export default function DropZone() {
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileDrop = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      setLoading(true);
      setResultImage(null);

      const originalWidth = img.width;
      const originalHeight = img.height;

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 224;
      canvas.height = 224;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 224, 224);

      const imageData = ctx.getImageData(0, 0, 224, 224).data;
      const floatArray = new Float32Array(224 * 224 * 3);

      for (let i = 0; i < 224 * 224; i++) {
        floatArray[i * 3 + 0] = imageData[i * 4 + 0] / 255;
        floatArray[i * 3 + 1] = imageData[i * 4 + 1] / 255;
        floatArray[i * 3 + 2] = imageData[i * 4 + 2] / 255;
      }

      try {
        const session = await ort.InferenceSession.create("/model.onnx");
        const inputTensor = new ort.Tensor("float32", floatArray, [1, 3, 224, 224]);
        const feeds: Record<string, ort.Tensor> = {
          [session.inputNames[0]]: inputTensor,
        };

        const output = await session.run(feeds);
        const mask = output[session.outputNames[0]].data as Float32Array;

        const outputCanvas = document.createElement("canvas");
        outputCanvas.width = originalWidth;
        outputCanvas.height = originalHeight;

        const outputCtx = outputCanvas.getContext("2d");
        if (!outputCtx) return;

        const fullSizeCanvas = document.createElement("canvas");
        fullSizeCanvas.width = originalWidth;
        fullSizeCanvas.height = originalHeight;
        const fullCtx = fullSizeCanvas.getContext("2d");
        if (!fullCtx) return;
        fullCtx.drawImage(img, 0, 0, originalWidth, originalHeight);
        const fullData = fullCtx.getImageData(0, 0, originalWidth, originalHeight).data;

        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = 224;
        maskCanvas.height = 224;
        const maskCtx = maskCanvas.getContext("2d");
        if (!maskCtx) return;

        const outputImg = maskCtx.createImageData(224, 224);
        for (let i = 0; i < mask.length; i++) {
          outputImg.data[i * 4 + 0] = imageData[i * 4 + 0];
          outputImg.data[i * 4 + 1] = imageData[i * 4 + 1];
          outputImg.data[i * 4 + 2] = imageData[i * 4 + 2];
          outputImg.data[i * 4 + 3] = Math.floor(mask[i] * 255);
        }

        maskCtx.putImageData(outputImg, 0, 0);

        outputCtx.drawImage(maskCanvas, 0, 0, originalWidth, originalHeight);

        outputCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResultImage(url);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error("Model processing error:", err);
        setError("Failed to process image. Try a different one.");
        setLoading(false);
      }
    };

    img.onerror = () => {
      setError("Could not load the selected image.");
      setLoading(false);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto text-center p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileDrop}
        className="mb-4 block w-full text-sm"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {loading && <p className="text-blue-500">Removing background...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {resultImage && (
        <div>
          <p className="font-medium mb-2">Result:</p>
          <img
            src={resultImage}
            alt="Processed"
            className="rounded shadow max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}
