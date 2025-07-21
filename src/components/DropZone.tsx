"use client";

import { useCallback, useState, useRef } from "react";
import * as ort from "onnxruntime-web";

export default function DropZone() {
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileDrop = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      setLoading(true);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size to model expected input size
      const width = 224;
      const height = 224;
      canvas.width = width;
      canvas.height = height;

      // Draw uploaded image resized on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Get pixel data from canvas
      const imageData = ctx.getImageData(0, 0, width, height).data;

      // Convert RGBA to float32 RGB and normalize to [0,1]
      const floatArray = new Float32Array(width * height * 3);
      for (let i = 0; i < width * height; i++) {
        floatArray[i * 3 + 0] = imageData[i * 4 + 0] / 255;
        floatArray[i * 3 + 1] = imageData[i * 4 + 1] / 255;
        floatArray[i * 3 + 2] = imageData[i * 4 + 2] / 255;
      }

      try {
        // Load ONNX model from public folder
        const session = await ort.InferenceSession.create("/model.onnx");

        // Create tensor with shape [1, 3, height, width]
        const inputTensor = new ort.Tensor("float32", floatArray, [1, 3, height, width]);
        const feeds: Record<string, ort.Tensor> = {};
        feeds[session.inputNames[0]] = inputTensor;

        // Run inference
        const output = await session.run(feeds);
        const mask = output[session.outputNames[0]].data as Float32Array;

        // Prepare output canvas and context
        const outputCanvas = document.createElement("canvas");
        outputCanvas.width = width;
        outputCanvas.height = height;
        const outputCtx = outputCanvas.getContext("2d");
        if (!outputCtx) {
          setLoading(false);
          return;
        }

        // Create image data for output
        const outputImg = outputCtx.createImageData(width, height);

        // Compose output image with alpha channel from mask
        for (let i = 0; i < mask.length; i++) {
          const alpha = Math.floor(mask[i] * 255);
          outputImg.data[i * 4 + 0] = imageData[i * 4 + 0];
          outputImg.data[i * 4 + 1] = imageData[i * 4 + 1];
          outputImg.data[i * 4 + 2] = imageData[i * 4 + 2];
          outputImg.data[i * 4 + 3] = alpha;
        }

        // Draw image data to output canvas
        outputCtx.putImageData(outputImg, 0, 0);

        // Convert canvas to blob and create URL to display
        outputCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResultImage(url);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("ONNX inference error:", error);
        setLoading(false);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-4">
      <input type="file" accept="image/*" onChange={handleFileDrop} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {loading && <p className="text-blue-500">Processing...</p>}
      {resultImage && (
        <div>
          <p className="font-medium mb-2">Result:</p>
          <img src={resultImage} alt="Background Removed" className="rounded shadow" />
        </div>
      )}
    </div>
  );
}
