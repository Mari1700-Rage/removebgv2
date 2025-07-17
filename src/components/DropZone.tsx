"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";
import cn from "classnames";
import ReactCrop, { Crop } from "react-image-crop";
import { LuCrop, LuMove, LuMaximize2, LuDownload } from "react-icons/lu";
import Button from "@/components/ui/Button";
import MaskEditor from "@/components/MaskEditor";
import { Dialog, Modal, ModalOverlay } from "@/components/ui/Modal";

export default function DropZone() {
  const [rows, setRows] = useState<{ id: string; imageUrl: string; transformedImageUrl: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"crop" | "mask">("crop");
  const [editOpen, setEditOpen] = useState(false);
  const [enableDrag, setEnableDrag] = useState(false);
  const [resizeMode, setResizeMode] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 50 });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [maskOpen, setMaskOpen] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);

  const transformed = useMemo(() => rows[0]?.transformedImageUrl, [rows]);
  const original = useMemo(() => rows[0]?.imageUrl, [rows]);

  const onDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        setRows([{ id: "1", imageUrl: img.src, transformedImageUrl: img.src }]);
      };
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  const onDragStart = (x: number, y: number) => setDragStart({ x: x - position.x, y: y - position.y });
  const onDragMove = (x: number, y: number) => {
    if (!dragStart) return;
    setPosition({ x: x - dragStart.x, y: y - dragStart.y });
  };
  const resetTransform = () => {
    setEnableDrag(false);
    setResizeMode(false);
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const downloadImage = () => {
    // implement canvas download based on your logic
    alert("Download triggered");
  };

  if (!original) {
    return (
      <div {...getRootProps()} className="border-2 border-dashed p-8 text-center">
        <input {...getInputProps()} />
        {isDragActive ? "Drop image here…" : "Drag or click to upload image"}
      </div>
    );
  }

  return (
    <div>
      {/* Show image and edit button */}
      {transformed && (
        <>
          <img src={transformed} alt="Preview" className="max-w-full mb-4" />
          <div className="flex gap-2">
            <Button onClick={() => setEditOpen(true)}>Edit</Button>
            <Button onClick={downloadImage}>Download</Button>
          </div>
        </>
      )}

      {/* Crop & Mask Modal */}
      <ModalOverlay isOpen={editOpen} onOpenChange={setEditOpen} isDismissable>
        <Modal>
          <Dialog>
            <div className="flex space-x-2 mb-4">
              <Button variant={activeTab === "crop" ? "primary" : "outline"} onClick={() => setActiveTab("crop")}>
                Crop
              </Button>
              <Button variant={activeTab === "mask" ? "primary" : "outline"} onClick={() => setActiveTab("mask")}>
                Mask
              </Button>
            </div>

            {activeTab === "crop" ? (
              <>
                <div className="flex gap-2 mb-4">
                  <Button onClick={resetTransform}>Reset</Button>
                  <Button onClick={() => setEnableDrag(true)}>Move</Button>
                  <Button onClick={() => setResizeMode(true)}>Resize</Button>
                </div>
                <div className="relative overflow-hidden border rounded h-64">
                  {enableDrag || resizeMode ? (
                    <img
                      src={transformed}
                      ref={imgRef}
                      draggable={false}
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        cursor: enableDrag ? "move" : "ns-resize",
                      }}
                      onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
                      onMouseMove={(e) => (enableDrag || resizeMode ? onDragMove(e.clientX, e.clientY) : null)}
                      onMouseUp={() => setDragStart(null)}
                      onTouchStart={(e) => {
                        const t = e.touches[0];
                        onDragStart(t.clientX, t.clientY);
                      }}
                      onTouchMove={(e) => {
                        const t = e.touches[0];
                        onDragMove(t.clientX, t.clientY);
                      }}
                      onTouchEnd={() => setDragStart(null)}
                    />
                  ) : (
                    <ReactCrop crop={crop} onChange={setCrop} onComplete={setCompletedCrop} ruleOfThirds>
                      <img src={transformed} ref={imgRef} alt="To crop" />
                    </ReactCrop>
                  )}
                </div>
                <div className="mt-4 text-right">
                  <Button disabled={!enableDrag && !resizeMode && !completedCrop} onClick={downloadImage}>
                    <LuDownload className="mr-2" /> Download
                  </Button>
                </div>
              </>
            ) : (
              activeTab === "mask" &&
              transformed && (
                <MaskEditor
                  originalImage={original}
                  removedBgImage={transformed}
                  onSave={() => {
                    setMaskOpen(false);
                    setEditOpen(false);
                  }}
                  onClose={() => {
                    setMaskOpen(false);
                    setEditOpen(false);
                  }}
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
