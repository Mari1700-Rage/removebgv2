"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import * as ort from "onnxruntime-web";
import { loadOnnxModel } from "@/lib/loadOnnxModel";
import { toast } from "sonner";

export default function DropZone() {
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    loadOnnxModel()
      .then(setSession)
      .catch((err) => {
        console.error("Failed to load ONNX model:", err);
        toast.error("Model failed to load.");
      });
  }, []);

  const processImage = useCallback(
    async (img: HTMLImageElement) => {
      if (!session) return;

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      const floatData = new Float32Array(img.width * img.height * 3);
      for (let i = 0; i < img.width * img.height; i++) {
        floatData[i] = imageData.data[i * 4] / 255; // R
        floatData[i + img.width * img.height] =
          imageData.data[i * 4 + 1] / 255; // G
        floatData[i + img.width * img.height * 2] =
          imageData.data[i * 4 + 2] / 255; // B
      }

      const inputTensor = new ort.Tensor(
        "float32",
        floatData,
        [1, 3, img.height, img.width]
      );

      const output = await session.run({ input: inputTensor });
      const outputTensor = output[Object.keys(output)[0]];

      // Convert mask to ImageData
      const mask = outputTensor.data as Float32Array;
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = img.width;
      outputCanvas.height = img.height;
      const outputCtx = outputCanvas.getContext("2d");
      if (!outputCtx) return;
      const maskImage = outputCtx.createImageData(img.width, img.height);

      for (let i = 0; i < mask.length; i++) {
        const alpha = Math.max(0, Math.min(255, mask[i] * 255));
        maskImage.data[i * 4 + 0] = imageData.data[i * 4];
        maskImage.data[i * 4 + 1] = imageData.data[i * 4 + 1];
        maskImage.data[i * 4 + 2] = imageData.data[i * 4 + 2];
        maskImage.data[i * 4 + 3] = alpha;
      }

      outputCtx.putImageData(maskImage, 0, 0);
      setResultUrl(outputCanvas.toDataURL());
    },
    [session]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      // ✅ Create a temporary object URL (always a string)
      const objectUrl = URL.createObjectURL(file);
      setImageSrc(objectUrl);

      const img = new Image();
      img.src = objectUrl;
      img.onload = () => {
        processImage(img);
        // Clean up the object URL after processing to avoid memory leaks
        URL.revokeObjectURL(objectUrl);
      };
      img.onerror = () => {
        toast.error("Could not load the image file.");
        URL.revokeObjectURL(objectUrl);
      };
    },
    [processImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
  });

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>
          {isDragActive
            ? "Drop the image here..."
            : "Drag and drop an image, or click to upload."}
        </p>
      </div>

      {resultUrl && typeof resultUrl === "string" && (
        <div className="mt-6">
          <h3 className="mb-2 font-semibold">Result</h3>
          <img
            src={resultUrl}
            alt="Processed"
            className="rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}
