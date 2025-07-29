"use client";

import { useCallback, useState, useRef } from "react";
import * as ort from "onnxruntime-web";

export default function DropZone() {
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileDrop = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setResultImage(null);
      const file = event.target.files?.[0];

      if (!file || !file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }

      const img = new Image();
      const imgURL = URL.createObjectURL(file);
      img.src = imgURL;

      img.onload = async () => {
        setLoading(true);
        const canvas = canvasRef.current;
        if (!canvas) {
          setError("Canvas not available.");
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Canvas context not found.");
          return;
        }

        const originalWidth = img.width;
        const originalHeight = img.height;

        canvas.width = 224;
        canvas.height = 224;
        ctx.drawImage(img, 0, 0, 224, 224);

        const imageData = ctx.getImageData(0, 0, 224, 224).data;
        const floatArray = new Float32Array(224 * 224 * 3);

        for (let i = 0; i < 224 * 224; i++) {
          floatArray[i * 3 + 0] = imageData[i * 4 + 0] / 255;
          floatArray[i * 3 + 1] = imageData[i * 4 + 1] / 255;
          floatArray[i * 3 + 2] = imageData[i * 4 + 2] / 255;
        }

        let session;
        try {
          session = await ort.InferenceSession.create("/model.onnx");
          console.log("ONNX model loaded:", session);
        } catch (e) {
          console.error("Session creation failed:", e);
          setError("Failed to load ONNX model.");
          setLoading(false);
          return;
        }

        const inputTensor = new ort.Tensor("float32", floatArray, [1, 3, 224, 224]);
        const feeds = { [session.inputNames[0]]: inputTensor };

        let output;
        try {
          output = await session.run(feeds);
          console.log("ONNX output:", output);
        } catch (e) {
          console.error("ONNX run error:", e);
          setError("ONNX inference failed.");
          setLoading(false);
          return;
        }

        try {
          const mask = output[session.outputNames[0]].data as Float32Array;

          const outputCanvas = document.createElement("canvas");
          outputCanvas.width = originalWidth;
          outputCanvas.height = originalHeight;

          const outputCtx = outputCanvas.getContext("2d");
          if (!outputCtx) throw new Error("Output canvas context error.");

          const maskCanvas = document.createElement("canvas");
          maskCanvas.width = 224;
          maskCanvas.height = 224;

          const maskCtx = maskCanvas.getContext("2d");
          if (!maskCtx) throw new Error("Mask canvas context error.");

          const maskImage = maskCtx.createImageData(224, 224);
          for (let i = 0; i < mask.length; i++) {
            maskImage.data[i * 4 + 0] = imageData[i * 4 + 0];
            maskImage.data[i * 4 + 1] = imageData[i * 4 + 1];
            maskImage.data[i * 4 + 2] = imageData[i * 4 + 2];
            maskImage.data[i * 4 + 3] = Math.floor(mask[i] * 255);
          }

          maskCtx.putImageData(maskImage, 0, 0);
          outputCtx.drawImage(maskCanvas, 0, 0, originalWidth, originalHeight);

          outputCanvas.toBlob((blob) => {
            if (blob) {
              const resultURL = URL.createObjectURL(blob);
              setResultImage(resultURL);
              console.log("Result image URL:", resultURL);
            }
            setLoading(false);
            URL.revokeObjectURL(imgURL);
          });
        } catch (e) {
          console.error("Post-processing error:", e);
          setError("Failed to render output.");
          setLoading(false);
        }
      };

      img.onerror = () => {
        setError("Could not load the image.");
        setLoading(false);
        URL.revokeObjectURL(imgURL);
      };
    },
    []
  );

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

      <canvas ref={canvasRef} width={224} height={224} style={{ display: "none" }} />

      {loading && <p className="text-blue-500">Removing background...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {resultImage && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Result:</p>
          <img
            src={resultImage}
            alt="Processed"
            className="rounded shadow max-w-full h-auto mx-auto"
          />
        </div>
      )}
    </div>
  );
}
