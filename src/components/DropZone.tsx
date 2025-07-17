"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import cn from "classnames";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { LuCrop, LuMove, LuMaximize2, LuDownload } from "react-icons/lu";
import Button from "@/components/ui/Button";
import MaskEditor from "@/components/MaskEditor";
import { Dialog, Modal, ModalOverlay } from "@/components/ui/Modal";

export default function DropZone() {
  const [mounted, setMounted] = useState(false);
  const [rows, setRows] = useState([] as { id: string; imageUrl: string; transformedImageUrl: string }[]);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"crop" | "mask">("crop");

  // Edit states
  const [enableDrag, setEnableDrag] = useState(false);
  const [resizeMode, setResizeMode] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 50 });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [maskOpen, setMaskOpen] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const transformed = rows[0]?.transformedImageUrl;
  const original = rows[0]?.imageUrl;

  const onDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRows([{ id: "1", imageUrl: reader.result as string, transformedImageUrl: reader.result as string }]);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  // Pointer event handlers
  const startPointer = useCallback((e: React.PointerEvent) => {
    imgRef.current?.setPointerCapture(e.pointerId);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [position.x, position.y]);

  const movePointer = useCallback((e: React.PointerEvent) => {
    if (!dragStart) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragStart]);

  const endPointer = useCallback((e: React.PointerEvent) => {
    imgRef.current?.releasePointerCapture(e.pointerId);
    setDragStart(null);
  }, []);

  const resetTransform = () => {
    setEnableDrag(false);
    setResizeMode(false);
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const downloadImage = () => {
    const imgEl = imgRef.current;
    if (!imgEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(imgEl, 0, 0);
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "edited.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

  if (!mounted) return null;

  if (!original) {
    return (
      <div {...getRootProps()} className="border-2 border-dashed p-8 text-center rounded-lg">
        <input {...getInputProps()} />
        {isDragActive ? "Drop image..." : "Drag/click to upload"}
      </div>
    );
  }

  return (
    <div>
      <img src={transformed!} alt="Preview" className="max-w-full mb-4 rounded-lg" />
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setEditOpen(true)}>Edit</Button>
        <Button onClick={downloadImage}>Download</Button>
      </div>

      {/* Editor Modal */}
      <ModalOverlay isOpen={editOpen} onOpenChange={setEditOpen} isDismissable>
        <Modal>
          <Dialog>
            {/* Tabs */}
            <div className="flex mb-4">
              <Button variant={activeTab === "crop" ? "primary" : "outline"} onClick={() => setActiveTab("crop")}>
                <LuCrop /> Crop
              </Button>
              <Button variant={activeTab === "mask" ? "primary" : "outline"} onClick={() => setActiveTab("mask")}>
                <LuMove /> Mask
              </Button>
            </div>

            {activeTab === "crop" ? (
              <>
                {/* Controls */}
                <div className="flex gap-2 mb-4">
                  <Button onClick={resetTransform}><LuPlay /> Reset</Button>
                  <Button onClick={() => { setEnableDrag(true); setResizeMode(false); }}><LuMove /> Move</Button>
                  <Button onClick={() => { setEnableDrag(false); setResizeMode(true); }}><LuMaximize2 /> Resize</Button>
                </div>

                {/* Editing viewport */}
                <div className="relative w-full h-64 overflow-hidden border rounded-lg">
                  {(enableDrag || resizeMode) ? (
                    <img
                      src={transformed!}
                      ref={imgRef}
                      draggable={false}
                      className="max-w-full max-h-full object-contain"
                      style={{ transform: `translate(${position.x}px,${position.y}px) scale(${scale})` }}
                      onPointerDown={startPointer}
                      onPointerMove={movePointer}
                      onPointerUp={endPointer}
                      onPointerCancel={endPointer}
                    />
                  ) : (
                    <ReactCrop crop={crop} onChange={setCrop} onComplete={setCompletedCrop} ruleOfThirds>
                      <img src={transformed!} ref={imgRef} alt="To crop" className="max-w-full" />
                    </ReactCrop>
                  )}
                </div>

                <div className="mt-4 text-right">
                  <Button onClick={downloadImage} disabled={!enableDrag && !resizeMode && !completedCrop}>
                    <LuDownload /> Download
                  </Button>
                </div>
              </>
            ) : (
              activeTab === "mask" && (
                <MaskEditor
                  originalImage={original!}
                  removedBgImage={transformed!}
                  onSave={() => setEditOpen(false)}
                  onClose={() => setEditOpen(false)}
                  isInline
                />
              )
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}
