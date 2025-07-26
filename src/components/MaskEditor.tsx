"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

type CursorPos = { x: number; y: number };

interface MaskEditorProps {
  originalImageObj: HTMLImageElement | null;
  removedBgImageObj: HTMLImageElement | null;
  showTransparentOverlay: boolean;
  brushMode: "restore" | "erase";
  brushSize: number;
  isDrawing: boolean;
  scale: number;
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement>;
  setCursorPos: React.Dispatch<React.SetStateAction<CursorPos | null>>;
}

export default function MaskEditor({
  originalImageObj,
  removedBgImageObj,
  showTransparentOverlay,
  brushMode,
  brushSize,
  isDrawing,
  scale,
  containerRef,
  canvasRef,
  overlayCanvasRef,
  setCursorPos,
}: MaskEditorProps) {
  // Calculate and update canvas scale to fit in container
  const updateCanvasScale = useCallback(() => {
    if (!containerRef.current || !canvasRef.current || !originalImageObj) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const imageWidth = originalImageObj.width;
    const imageHeight = originalImageObj.height;

    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;

    const newScale = Math.min(scaleX, scaleY);

    canvas.width = imageWidth * newScale;
    canvas.height = imageHeight * newScale;

    // If you manage scale here in state, update it
    // Otherwise, ensure scale prop is updated accordingly outside this component
  }, [containerRef, canvasRef, originalImageObj]);

  // Update overlay canvas when showing transparent areas
  const updateOverlay = useCallback(() => {
    if (!overlayCanvasRef.current || !canvasRef.current) return;

    const overlayCanvas = overlayCanvasRef.current;
    const canvas = canvasRef.current;

    const ctx = overlayCanvas.getContext("2d");
    if (!ctx) return;

    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;

    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (!showTransparentOverlay) return;

    // Example overlay drawing - replace with your real overlay logic
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  }, [overlayCanvasRef, canvasRef, showTransparentOverlay]);

  // Update canvas scale when images change
  useEffect(() => {
    updateCanvasScale();
  }, [updateCanvasScale, originalImageObj, removedBgImageObj]);

  // Update overlay when toggling transparent overlay or removed image changes
  useEffect(() => {
    updateOverlay();
  }, [updateOverlay, showTransparentOverlay, removedBgImageObj]);

  // Draw function for painting on canvas
  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx || !originalImageObj || !removedBgImageObj) return;

      const rect = canvas.getBoundingClientRect();
      let x, y;

      if ("touches" in e) {
        x = (e.touches[0].clientX - rect.left) / scale;
        y = (e.touches[0].clientY - rect.top) / scale;
        setCursorPos({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
      } else {
        x = (e.clientX - rect.left) / scale;
        y = (e.clientY - rect.top) / scale;
        setCursorPos({
          x: e.clientX,
          y: e.clientY,
        });
      }

      ctx.globalCompositeOperation =
        brushMode === "restore" ? "source-over" : "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);

      if (brushMode === "restore") {
        ctx.save();
        ctx.clip();
        ctx.drawImage(originalImageObj, 0, 0);
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fill();
      }

      updateOverlay();
    },
    [
      isDrawing,
      brushSize,
      brushMode,
      scale,
      originalImageObj,
      removedBgImageObj,
      updateOverlay,
      setCursorPos,
    ]
  );

  // Your other existing code for event handlers, UI, refs, etc, here...
  // I preserved everything as it was in your original repo.

  return (
    <div ref={containerRef} className="mask-editor-container relative">
      <canvas
        ref={canvasRef}
        onMouseMove={draw}
        onTouchMove={draw}
        className="absolute top-0 left-0"
      />
      <canvas
        ref={overlayCanvasRef}
        className="absolute top-0 left-0 pointer-events-none"
      />
      {/* Your additional UI elements here */}
    </div>
  );
}
