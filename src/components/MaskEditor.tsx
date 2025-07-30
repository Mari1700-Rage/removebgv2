import React, { useRef, useEffect, useState, useCallback } from 'react';
import Slider from './Slider';
import { LuUndo2, LuRedo2, LuPencil, LuEraser, LuSave, LuX, LuSettings } from 'react-icons/lu';
import { cn } from '@/lib/utils';

interface MaskEditorProps {
  originalImage: string;
  removedBgImage: string;
  mask?: string; // Optional existing mask
  onSave: (mask: string) => void;
  onClose: () => void;
  isInline?: boolean; // New prop to indicate if it's embedded in another component
}

type BrushMode = 'restore' | 'remove';
type HistoryItem = { dataURL: string };

const MaskEditor: React.FC<MaskEditorProps> = ({
  originalImage,
  removedBgImage,
  mask,
  onSave,
  onClose,
  isInline = false // Default to false (standalone modal)
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [brushSize, setBrushSize] = useState<number>(20);
  const [brushMode, setBrushMode] = useState<BrushMode>('restore');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [originalImageObj, setOriginalImageObj] = useState<HTMLImageElement | null>(null);
  const [removedBgImageObj, setRemovedBgImageObj] = useState<HTMLImageElement | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showTransparentOverlay, setShowTransparentOverlay] = useState<boolean>(true);
  const [cursorPos, setCursorPos] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [mobileToolsOpen, setMobileToolsOpen] = useState<boolean>(false);
  
  // Setup canvas and load images
  useEffect(() => {
    const originalImg = new Image();
    originalImg.onload = () => {
      setOriginalImageObj(originalImg);
    };
    originalImg.src = originalImage;

    const removedBgImg = new Image();
    removedBgImg.onload = () => {
      setRemovedBgImageObj(removedBgImg);
    };
    removedBgImg.src = removedBgImage;
  }, [originalImage, removedBgImage]);

  // Initialize canvas when images are loaded
  useEffect(() => {
    if (!originalImageObj || !removedBgImageObj || !canvasRef.current || !overlayCanvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const overlay = overlayCanvasRef.current;
    const overlayCtx = overlay.getContext('2d');
    if (!overlayCtx) return;

    // Set canvas dimensions
    canvas.width = originalImageObj.width;
    canvas.height = originalImageObj.height;
    overlay.width = originalImageObj.width;
    overlay.height = originalImageObj.height;

    // Draw the removed background image as base
    ctx.drawImage(removedBgImageObj, 0, 0);

    // If we have an existing mask, apply it
    if (mask) {
      const maskImg = new Image();
      maskImg.onload = () => {
        if (!ctx) return;
        ctx.drawImage(maskImg, 0, 0);
        addToHistory();
      };
      maskImg.src = mask;
    } else {
      addToHistory();
    }

    // Calculate scale to fit canvas in viewport
    updateCanvasScale();

  }, [originalImageObj, removedBgImageObj]);

  // Update overlay canvas when showing transparent areas
  useEffect(() => {
    updateOverlay();
  }, [showTransparentOverlay, removedBgImageObj]);

  // Draw function for painting on canvas
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || !originalImageObj || !removedBgImageObj) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      x = (e.touches[0].clientX - rect.left) / scale;
      y = (e.touches[0].clientY - rect.top) / scale;
      setCursorPos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    } else {
      x = (e.clientX - rect.left) / scale;
      y = (e.clientY - rect.top) / scale;
      setCursorPos({
        x: e.clientX,
        y: e.clientY
      });
    }
    
    ctx.globalCompositeOperation = brushMode === 'restore' ? 'source-over' : 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    
    if (brushMode === 'restore') {
      // When restoring, draw from the original image
      ctx.save();
      ctx.clip();
      ctx.drawImage(originalImageObj, 0, 0);
      ctx.restore();
    } else {
      // When removing, just erase with transparent pixels
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fill();
    }
    
    updateOverlay();
  }, [isDrawing, brushSize, brushMode, scale, originalImageObj, removedBgImageObj]);

  // Calculate and update canvas scale to fit in container
  const updateCanvasScale = useCallback(() => {
    if (!containerRef.current || !canvasRef.current || !originalImageObj) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const imageRatio = originalImageObj.width / originalImageObj.height;
    const containerRatio = containerWidth / containerHeight;
    
    let newScale;
    if (imageRatio > containerRatio) {
      // Image is wider than container
      newScale = containerWidth / originalImageObj.width;
    } else {
      // Image is taller than container
      newScale = containerHeight / originalImageObj.height;
    }
    
    // Apply a small reduction to ensure it fits comfortably
    newScale = newScale * 0.9;
    setScale(newScale);
  }, [originalImageObj]);

  // Update the overlay to show transparent areas
  const updateOverlay = useCallback(() => {
    if (!overlayCanvasRef.current || !canvasRef.current || !showTransparentOverlay) return;
    
    const overlay = overlayCanvasRef.current;
    const overlayCtx = overlay.getContext('2d', { willReadFrequently: true });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!overlayCtx || !ctx) return;
    
    // Clear the overlay
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
    
    if (showTransparentOverlay) {
      // Get the current canvas image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Create a new image data for the overlay
      const overlayData = overlayCtx.createImageData(overlay.width, overlay.height);
      const overlayDataArr = overlayData.data;
      
      // For each pixel, check if it's transparent and mark it in the overlay
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) { // If alpha channel is less than 128 (semi-transparent)
          // Set to a checkerboard pattern or highlight color
          overlayDataArr[i] = 255;   // R
          overlayDataArr[i + 1] = 0; // G
          overlayDataArr[i + 2] = 128; // B
          overlayDataArr[i + 3] = 100; // Alpha
        }
      }
      
      overlayCtx.putImageData(overlayData, 0, 0);
    }
  }, [showTransparentOverlay]);

  // Add current canvas state to history
  const addToHistory = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    
    // If we're not at the end of history, truncate it
    if (historyIndex < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    setHistory(prevHistory => [...prevHistory, { dataURL }]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  }, [history, historyIndex]);

  // Apply a history state to the canvas
  const applyHistoryState = useCallback((index: number) => {
    if (index < 0 || index >= history.length || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Reset the compositing mode to ensure proper drawing
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, 0, 0);
      updateOverlay();
    };
    img.src = history[index].dataURL;
    
    setHistoryIndex(index);
  }, [history, updateOverlay]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      applyHistoryState(historyIndex - 1);
    }
  }, [historyIndex, applyHistoryState]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      applyHistoryState(historyIndex + 1);
    }
  }, [historyIndex, history.length, applyHistoryState]);

  // Handle save
  const handleSave = useCallback(() => {
    if (!canvasRef.current) return;
    const dataURL = canvasRef.current.toDataURL();
    onSave(dataURL);
  }, [onSave]);

  // Event handlers for drawing
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  }, [draw]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      addToHistory();
    }
  }, [isDrawing, addToHistory]);

  // Update canvas scale on window resize
  useEffect(() => {
    const handleResize = () => {
      updateCanvasScale();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCanvasScale]);

  // Tool panel content (extracted to avoid repetition)
  const ToolPanel = () => (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Brush Tools</h3>
        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          <button 
            onClick={() => setBrushMode('restore')}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-all",
              brushMode === 'restore' 
                ? "bg-[#6C5CE7] text-white" 
                : "bg-white text-gray-500 hover:bg-gray-50"
            )}
          >
            <LuPencil className="size-4" />
            <span>Restore</span>
          </button>
          <button 
            onClick={() => setBrushMode('remove')}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-all",
              brushMode === 'remove' 
                ? "bg-[#6C5CE7] text-white" 
                : "bg-white text-gray-500 hover:bg-gray-50"
            )}
          >
            <LuEraser className="size-4" />
            <span>Remove</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Brush Size</h3>
        <Slider
          min={1}
          max={100}
          value={brushSize}
          onChange={setBrushSize}
        />
      </div>
      
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">History</h3>
        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          <button 
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-all",
              historyIndex <= 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-500 hover:bg-gray-50"
            )}
          >
            <LuUndo2 className="size-4" />
            <span>Undo</span>
          </button>
          <button 
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-all",
              historyIndex >= history.length - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-500 hover:bg-gray-50"
            )}
          >
            <LuRedo2 className="size-4" />
            <span>Redo</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Options</h3>
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="show-transparent" 
            checked={showTransparentOverlay}
            onChange={() => setShowTransparentOverlay(!showTransparentOverlay)}
            className="rounded border-gray-200 text-[#6C5CE7] focus:ring-[#6C5CE7]"
          />
          <label htmlFor="show-transparent" className="text-sm text-gray-600 dark:text-gray-400">
            Highlight transparent areas
          </label>
        </div>
      </div>
    </div>
  );

  // Mobile quick actions panel
  const MobileQuickActions = () => (
    <div className="md:hidden flex justify-between items-center px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex space-x-2">
        <button 
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          className={cn(
            "p-2 rounded-full",
            historyIndex <= 0
              ? "text-gray-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <LuUndo2 className="size-5" />
        </button>
        <button 
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          className={cn(
            "p-2 rounded-full",
            historyIndex >= history.length - 1
              ? "text-gray-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <LuRedo2 className="size-5" />
        </button>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={() => setBrushMode('restore')}
          className={cn(
            "p-2 rounded-full",
            brushMode === 'restore' 
              ? "bg-[#6C5CE7] text-white" 
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <LuPencil className="size-5" />
        </button>
        <button 
          onClick={() => setBrushMode('remove')}
          className={cn(
            "p-2 rounded-full",
            brushMode === 'remove' 
              ? "bg-[#6C5CE7] text-white" 
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <LuEraser className="size-5" />
        </button>
        <button 
          onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LuSettings className="size-5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isInline ? (
        // Inline version - just the editor content without the modal wrapper
        <div className="flex flex-col w-full h-[70vh] max-h-[70vh]">
          <div className="flex flex-1 overflow-hidden">
            {/* Tool panel - hide on mobile */}
            <div className="hidden md:flex w-64 p-4 border-r border-gray-200 dark:border-gray-700 flex-col space-y-4">
              <ToolPanel />
              
              <div className="mt-auto">
                <button 
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5B4ED1] transition-colors"
                >
                  <LuSave className="size-4" />
                  Save Changes
                </button>
              </div>
            </div>
            
            {/* Canvas container */}
            <div 
              ref={containerRef} 
              className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 relative flex items-center justify-center"
            >
              <div className="relative" style={{ transform: `scale(${scale})` }}>
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="touch-none"
                />
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute top-0 left-0 pointer-events-none touch-none"
                />
              </div>
              
              {/* Cursor preview */}
              {isDrawing && (
                <div
                  className="absolute rounded-full border-2 border-white pointer-events-none"
                  style={{
                    width: brushSize * scale,
                    height: brushSize * scale,
                    border: '2px solid white',
                    boxShadow: '0 0 0 1px black',
                    marginLeft: '-' + (brushSize * scale) / 2 + 'px',
                    marginTop: '-' + (brushSize * scale) / 2 + 'px',
                    transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
                    display: isDrawing ? 'block' : 'none',
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Mobile tools panel (slides up from bottom) */}
          {mobileToolsOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileToolsOpen(false)}>
              <div 
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl p-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                <ToolPanel />
                <button 
                  onClick={() => setMobileToolsOpen(false)}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          
          {/* Mobile quick actions toolbar */}
          <MobileQuickActions />
          
          {/* Mobile Save button - fixed at bottom */}
          <div className="md:hidden fixed bottom-16 right-4 z-30">
            <button 
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-full bg-[#6C5CE7] p-3 text-white shadow-lg"
            >
              <LuSave className="size-6" />
            </button>
          </div>
        </div>
      ) : (
        // Standalone modal version (original implementation) with mobile responsive changes
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col w-11/12 h-[90vh] max-w-6xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Mask</h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
              >
                <LuX className="size-6" />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Tool panel - hidden on mobile */}
              <div className="hidden md:flex w-64 p-4 border-r border-gray-200 dark:border-gray-700 flex-col space-y-4">
                <ToolPanel />
                
                <div className="mt-auto">
                  <button 
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5B4ED1] transition-colors"
                  >
                    <LuSave className="size-4" />
                    Save Changes
                  </button>
                </div>
              </div>
              
              {/* Canvas container */}
              <div 
                ref={containerRef} 
                className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 relative flex items-center justify-center"
              >
                <div className="relative" style={{ transform: `scale(${scale})` }}>
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="touch-none"
                  />
                  <canvas
                    ref={overlayCanvasRef}
                    className="absolute top-0 left-0 pointer-events-none touch-none"
                  />
                </div>
                
                {/* Cursor preview */}
                {isDrawing && (
                  <div
                    className="absolute rounded-full border-2 border-white pointer-events-none"
                    style={{
                      width: brushSize * scale,
                      height: brushSize * scale,
                      border: '2px solid white',
                      boxShadow: '0 0 0 1px black',
                      marginLeft: '-' + (brushSize * scale) / 2 + 'px',
                      marginTop: '-' + (brushSize * scale) / 2 + 'px',
                      transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
                      display: isDrawing ? 'block' : 'none',
                    }}
                  />
                )}
              </div>
            </div>
            
            {/* Mobile tools panel (slides up from bottom) */}
            {mobileToolsOpen && (
              <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileToolsOpen(false)}>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl p-4"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                  <ToolPanel />
                  <button 
                    onClick={() => setMobileToolsOpen(false)}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            
            {/* Mobile quick actions toolbar */}
            <MobileQuickActions />
            
            {/* Mobile Save button - fixed at bottom */}
            <div className="md:hidden fixed bottom-16 right-4 z-30">
              <button 
                onClick={handleSave}
                className="flex items-center justify-center gap-2 rounded-full bg-[#6C5CE7] p-3 text-white shadow-lg"
              >
                <LuSave className="size-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MaskEditor; 
