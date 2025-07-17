import React, { useState, useRef } from 'react';
import cn from 'classnames';
import ReactCrop, { Crop } from 'react-image-crop';
import { LuPencil, LuCrop, LuMove, LuMaximize2, LuDownload } from 'react-icons/lu';
import Button from './Button'; // Assuming a Button component
import MaskEditor from './MaskEditor'; // Your MaskEditor component
import Dialog from './Dialog'; // Assuming Modal/Dialog components
import Modal from './Modal';
import ModalOverlay from './ModalOverlay';

interface Props {
  storeReference: any; // Adjust with your store type
  rowIds: string[];
  activeEditTab: 'crop' | 'mask';
  setIsCropModalOpen: (open: boolean) => void;
  setEnableDrag: (enable: boolean) => void;
  setIsResizeMode: (resize: boolean) => void;
  enableDrag: boolean;
  isResizeMode: boolean;
  resetImageTransform: () => void;
  useBackgroundImage: boolean;
  selectedColor: string;
  selectedBackground: string | null;
  backgroundImageDimensions: { width: number; height: number } | null;
  crop: Crop;
  setCrop: (crop: Crop) => void;
  setCompletedCrop: (crop: Crop | null) => void;
  completedCrop: Crop | null;
  imageRef: React.RefObject<HTMLImageElement>;
  imagePosition: { x: number; y: number };
  setImagePosition: (pos: { x: number; y: number }) => void;
  imageScale: number;
  dragStart: { x: number; y: number } | null;
  setDragStart: (pos: { x: number; y: number } | null) => void;
  handleResizeStart: React.MouseEventHandler<HTMLDivElement> & React.TouchEventHandler<HTMLDivElement>;
  handleResizeMove: React.MouseEventHandler<HTMLDivElement> & React.TouchEventHandler<HTMLDivElement>;
  handleResizeEnd: React.MouseEventHandler<HTMLDivElement> & React.TouchEventHandler<HTMLDivElement>;
  downloadCroppedImage: () => void;
  editedMask: any; // Type accordingly
  saveMaskEdit: (mask: any) => void;
  isMaskEditorOpen: boolean;
  setIsMaskEditorOpen: (open: boolean) => void;
  isEditToolsOpen: boolean;
}

const CropMaskEditor: React.FC<Props> = ({
  storeReference,
  rowIds,
  activeEditTab,
  setIsCropModalOpen,
  setEnableDrag,
  setIsResizeMode,
  enableDrag,
  isResizeMode,
  resetImageTransform,
  useBackgroundImage,
  selectedColor,
  selectedBackground,
  backgroundImageDimensions,
  crop,
  setCrop,
  setCompletedCrop,
  completedCrop,
  imageRef,
  imagePosition,
  setImagePosition,
  imageScale,
  dragStart,
  setDragStart,
  handleResizeStart,
  handleResizeMove,
  handleResizeEnd,
  downloadCroppedImage,
  editedMask,
  saveMaskEdit,
  isMaskEditorOpen,
  setIsMaskEditorOpen,
  isEditToolsOpen,
}) => {
  const baseContainerStyle = {
    minHeight: useBackgroundImage && backgroundImageDimensions ? 'auto' : '40vh',
    padding: 0,
    margin: 0,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
    ...(useBackgroundImage && backgroundImageDimensions
      ? { aspectRatio: `${backgroundImageDimensions.width} / ${backgroundImageDimensions.height}` }
      : {}),
  };

  const backgroundStyle = {
    backgroundColor: useBackgroundImage ? 'transparent' : selectedColor,
    backgroundImage: useBackgroundImage && selectedBackground ? `url(${selectedBackground})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  // Handlers for drag positioning events
  const onDragStart = (clientX: number, clientY: number) => {
    setDragStart({ x: clientX - imagePosition.x, y: clientY - imagePosition.y });
  };

  const onDragMove = (clientX: number, clientY: number) => {
    if (dragStart) {
      setImagePosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
    }
  };

  // Extract the image src once for reuse
  const transformedImageUrl = storeReference?.getCell("images", rowIds[0], "transformedImageUrl") as string;
  const originalImageUrl = storeReference?.getCell("images", rowIds[0], "imageUrl") as string;

  return (
    <div>
      <ModalOverlay>
        <Modal>
          <Dialog>
            <div className="flex gap-2 mb-4">
              {/* Edit Mask Button */}
              <button
                onClick={() => setIsCropModalOpen(false)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all duration-300',
                  activeEditTab === 'mask'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
                aria-pressed={activeEditTab === 'mask'}
                type="button"
              >
                <LuPencil className="size-3.5" />
                <span>Edit Mask</span>
              </button>
            </div>

            {/* Tab Content - Crop Tools */}
            {activeEditTab === 'crop' && (
              <>
                <div className="mb-3 flex items-center gap-2 self-end">
                  {/* Mode Selection Buttons */}
                  <div className="flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <button
                      onClick={() => {
                        setEnableDrag(false);
                        setIsResizeMode(false);
                      }}
                      className={cn(
                        'flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-sm font-medium transition-all duration-300',
                        !enableDrag && !isResizeMode
                          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                      type="button"
                      aria-pressed={!enableDrag && !isResizeMode}
                    >
                      <LuCrop className="size-3.5" />
                      <span className="hidden xs:inline">Crop</span>
                    </button>

                    <button
                      onClick={() => {
                        setEnableDrag(true);
                        setIsResizeMode(false);
                      }}
                      className={cn(
                        'flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-sm font-medium transition-all duration-300',
                        enableDrag && !isResizeMode
                          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                      type="button"
                      aria-pressed={enableDrag && !isResizeMode}
                    >
                      <LuMove className="size-3.5" />
                      <span className="hidden xs:inline">Move</span>
                    </button>

                    <button
                      onClick={() => {
                        setEnableDrag(false);
                        setIsResizeMode(true);
                      }}
                      className={cn(
                        'flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-sm font-medium transition-all duration-300',
                        isResizeMode
                          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                      type="button"
                      aria-pressed={isResizeMode}
                    >
                      <LuMaximize2 className="size-3.5" />
                      <span className="hidden xs:inline">Resize</span>
                    </button>
                  </div>

                  {/* Reset Button */}
                  {(enableDrag || isResizeMode) && (
                    <button
                      onClick={resetImageTransform}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
                      type="button"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="size-3.5"
                        aria-hidden="true"
                      >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M3 21v-5h5" />
                      </svg>
                      <span className="hidden xs:inline">Reset</span>
                    </button>
                  )}
                </div>

                <div
                  className="relative p-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] rounded-lg overflow-auto"
                  style={backgroundStyle}
                >
                  <div className="relative w-full flex items-center justify-center" style={{ maxHeight: '70vh', ...backgroundStyle, ...baseContainerStyle }}>
                    {!enableDrag && !isResizeMode ? (
                      <ReactCrop
                        crop={crop}
                        onChange={setCrop}
                        onComplete={setCompletedCrop}
                        aspect={undefined}
                        className="rounded-lg overflow-hidden w-full h-full"
                        minWidth={0}
                        minHeight={0}
                        ruleOfThirds={true}
                        style={{ margin: 0, padding: 0 }}
                      >
                        <div id="crop-container" className="flex items-center justify-center relative w-full h-full p-0 m-0" style={baseContainerStyle}>
                          <img
                            ref={imageRef}
                            src={transformedImageUrl}
                            alt="Crop"
                            className={cn(
                              'max-w-full object-contain relative z-10 p-0 m-0',
                              useBackgroundImage && backgroundImageDimensions ? 'max-h-full' : 'max-h-[40vh] sm:max-h-[60vh]'
                            )}
                            style={{
                              padding: 0,
                              margin: 0,
                              transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                            }}
                          />
                        </div>
                      </ReactCrop>
                    ) : isResizeMode ? (
                      <div
                        id="crop-container"
                        className="flex items-center justify-center relative w-full h-full cursor-ns-resize"
                        style={baseContainerStyle}
                        onMouseDown={handleResizeStart}
                        onMouseMove={handleResizeMove}
                        onMouseUp={handleResizeEnd}
                        onMouseLeave={handleResizeEnd}
                        onTouchStart={handleResizeStart}
                        onTouchMove={handleResizeMove}
                        onTouchEnd={handleResizeEnd}
                      >
                        <img
                          ref={imageRef}
                          src={transformedImageUrl}
                          alt="Resize"
                          className={cn(
                            'max-w-full object-contain relative z-10 p-0 m-0',
                            useBackgroundImage && backgroundImageDimensions ? 'max-h-full' : 'max-h-[40vh] sm:max-h-[60vh]'
                          )}
                          style={{
                            padding: 0,
                            margin: 0,
                            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                            transformOrigin: 'center',
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        id="crop-container"
                        className="flex items-center justify-center relative w-full h-full cursor-move"
                        style={baseContainerStyle}
                        onMouseDown={(e) => {
                          onDragStart(e.clientX, e.clientY);
                          e.preventDefault();
                        }}
                        onMouseMove={(e) => {
                          onDragMove(e.clientX, e.clientY);
                          e.preventDefault();
                        }}
                        onMouseUp={(e) => {
                          setDragStart(null);
                          e.preventDefault();
                        }}
                        onMouseLeave={(e) => {
                          setDragStart(null);
                          e.preventDefault();
                        }}
                        onTouchStart={(e) => {
                          const touch = e.touches[0];
                          onDragStart(touch.clientX, touch.clientY);
                          e.preventDefault();
                        }}
                        onTouchMove={(e) => {
                          if (dragStart) {
                            const touch = e.touches[0];
                            onDragMove(touch.clientX, touch.clientY);
                            e.preventDefault();
                          }
                        }}
                        onTouchEnd={(e) => {
                          setDragStart(null);
                          e.preventDefault();
                        }}
                      >
                        <img
                          ref={imageRef}
                          src={transformedImageUrl}
                          alt="Position"
                          className={cn(
                            'max-w-full object-contain relative z-10 p-0 m-0',
                            useBackgroundImage && backgroundImageDimensions ? 'max-h-full' : 'max-h-[40vh] sm:max-h-[60vh]'
                          )}
                          style={{
                            padding: 0,
                            margin: 0,
                            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 flex justify-end gap-2 sm:gap-3">
                  <Button
                    type="button"
                    onClick={downloadCroppedImage}
                    disabled={!enableDrag && !isResizeMode && !completedCrop}
                    className="px-3 sm:px-6 py-2 bg-gradient-to-r from-[#6C5CE7] to-[#5a4bd4] text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed rounded-full"
                  >
                    <div className="flex items-center">
                      <LuDownload className="mr-2 size-4" />
                      <span className="font-medium text-xs sm:text-sm">
                        Download {isResizeMode ? 'Resized' : enableDrag ? 'Positioned' : 'Cropped'}
                      </span>
                    </div>
                  </Button>
                </div>
              </>
            )}

            {/* Tab Content - Mask Editor */}
            {activeEditTab === 'mask' && storeReference?.hasTable('images') && rowIds.length > 0 && (
              <div>
                <MaskEditor
                  originalImage={originalImageUrl}
                  removedBgImage={transformedImageUrl}
                  mask={editedMask || undefined}
                  onSave={saveMaskEdit}
                  onClose={() => setIsMaskEditorOpen(false)}
                  isInline={true}
                />
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>

      {/* MaskEditor Modal - Only when not in combined mode */}
      {isMaskEditorOpen && !isEditToolsOpen && storeReference?.hasTable('images') && rowIds.length > 0 && (
        <MaskEditor
          originalImage={originalImageUrl}
          removedBgImage={transformedImageUrl}
          mask={editedMask || undefined}
          onSave={saveMaskEdit}
          onClose={() => setIsMaskEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default CropMaskEditor;
