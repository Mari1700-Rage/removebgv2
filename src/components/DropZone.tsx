"use client"

import { useRowIds, useStore } from '@/lib/schema';
import { cn } from '@/lib/utils';
import { AutoModel, AutoProcessor, PreTrainedModel, Processor, RawImage } from '@huggingface/transformers';
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from "react-dropzone";
import { LuCrop, LuDownload, LuLoader2, LuMaximize2, LuMove, LuPlay, LuUpload, LuPencil, LuSettings } from 'react-icons/lu';
import { toast } from 'sonner';
import { Button } from './ui/Button';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, Modal, ModalOverlay, type DialogProps } from 'react-aria-components';
import BackgroundSelector from './BackgroundSelector';
import MaskEditor from './MaskEditor';

const BACKGROUND_COLORS = [
    { id: 'transparent', color: 'transparent' },
    { id: 'white', color: '#FFFFFF' },
    { id: 'black', color: '#000000' },
    { id: 'purple', color: '#800080' },
    { id: 'pink', color: '#FFC0CB' },
    { id: 'yellow', color: '#FFFF00' },
];

export default function DropZone() {
    const [isLoadingModel, setIsLoadingModel] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('transparent');
    const [showProcessed, setShowProcessed] = useState(false);
    const [isProcessingComplete, setIsProcessingComplete] = useState(false);
    const [customColor, setCustomColor] = useState('#6C5CE7');
    const [isCustomColorActive, setIsCustomColorActive] = useState(false);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [isMaskEditorOpen, setIsMaskEditorOpen] = useState(false);
    const [isEditToolsOpen, setIsEditToolsOpen] = useState(false); // New state for combined modal
    const [activeEditTab, setActiveEditTab] = useState<'mask' | 'crop'>('crop'); // Track which tab is active
    const [editedMask, setEditedMask] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
    const [useBackgroundImage, setUseBackgroundImage] = useState(false);
    const [backgroundImageDimensions, setBackgroundImageDimensions] = useState<{width: number, height: number} | null>(null);
    const [customBackgroundUploader, setCustomBackgroundUploader] = useState<File | null>(null);
    const [enableDrag, setEnableDrag] = useState(false);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
    const [isResizeMode, setIsResizeMode] = useState(false);
    const [imageScale, setImageScale] = useState(1);
    const customColorRef = useRef<HTMLInputElement>(null);
    const customBackgroundRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const backgroundImageRef = useRef<HTMLImageElement | null>(null);
    const storeReference = useStore();
    const rowIds = useRowIds("images")

    const modelRef = useRef<PreTrainedModel | null>(null);
    const processorRef = useRef<Processor | null>(null);
    const autoProcessRef = useRef<boolean>(true);

    const handleModelError = (error: any) => {
        console.error('Error loading model:', error);
        setError(error instanceof Error ? error : new Error('Failed to load model'));
        setIsLoadingModel(false);
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop: useCallback((acceptedFiles: File[]) => {
            // Reset states when new files are dropped
            setIsProcessingComplete(false);
            setShowProcessed(false);
            
            const processFile = async (file: File) => {
                return new Promise<void>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    
                    reader.onload = () => {
                        const base64String = reader.result as string;
                        const img = new Image();
                        img.src = base64String;
                        
                        img.onload = () => {
                            storeReference?.transaction(() => {
                                storeReference.addRow('images', {
                                    name: file.name,
                                    size: file.size,
                                    imageUrl: base64String,
                                    mediaType: file.type,
                                    height: img.height,
                                    width: img.width,
                                });
                            });
                            resolve();
                        };
                        
                        img.onerror = () => {
                            reject(new Error('Failed to load image'));
                        };
                    };
                    
                    reader.onerror = (error) => {
                        reject(error);
                        toast.error(`Error converting file to base64:${error}`);
                    };
                });
            };

            // Process files sequentially
            (async () => {
                try {
                    for (const file of acceptedFiles) {
                        await processFile(file);
                    }
                } catch (error) {
                    console.error('Error processing files:', error);
                }
            })();
        }, [storeReference]),
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"],
        },
    });

    const processImages = useCallback(async () => {
        try {
            const model = modelRef.current;
            const processor = processorRef.current;
            if (!model || !processor || !storeReference?.hasTable("images") || rowIds.length === 0) {
                return;
            }

            for (let i = 0; i < rowIds.length; i++) {
                if (storeReference?.getCell("images", `${rowIds[i]}`, "transformedImageUrl")) {
                    continue;
                }
                try {
                    // Load image
                    const img = await RawImage.fromURL(storeReference?.getCell("images", `${rowIds[i]}`, "imageUrl") as string);
                    // Pre-process image
                    const { pixel_values } = await processor(img);
                    // Predict alpha matte
                    const { output } = await model({ input: pixel_values });
                    const maskData = (
                        await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
                            img.width,
                            img.height,
                        )
                    ).data;

                    // Create new canvas
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        // Draw original image output to canvas
                        ctx.drawImage(img.toCanvas(), 0, 0);

                        // Update alpha channel
                        const pixelData = ctx.getImageData(0, 0, img.width, img.height);
                        for (let i = 0; i < maskData.length; ++i) {
                            pixelData.data[4 * i + 3] = maskData[i];
                        }
                        ctx.putImageData(pixelData, 0, 0);

                        if (selectedColor !== 'transparent' && !useBackgroundImage) {
                            // Add colored background
                            const tempCanvas = document.createElement("canvas");
                            tempCanvas.width = canvas.width;
                            tempCanvas.height = canvas.height;
                            const tempCtx = tempCanvas.getContext("2d");
                            if (tempCtx) {
                                tempCtx.fillStyle = selectedColor;
                                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                                tempCtx.drawImage(canvas, 0, 0);
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(tempCanvas, 0, 0);
                            }
                        } else if (useBackgroundImage && selectedBackground) {
                            // Add background image
                            const bgImg = new Image();
                            await new Promise<void>((resolve) => {
                                bgImg.onload = () => {
                                    const tempCanvas = document.createElement("canvas");
                                    tempCanvas.width = canvas.width;
                                    tempCanvas.height = canvas.height;
                                    const tempCtx = tempCanvas.getContext("2d");
                                    if (tempCtx) {
                                        // Draw background image with cover/contain logic
                                        const imgRatio = bgImg.width / bgImg.height;
                                        const canvasRatio = canvas.width / canvas.height;
                                        let sx, sy, sWidth, sHeight;
                                        
                                        if (imgRatio > canvasRatio) {
                                            // Image is wider, use height as constraint
                                            sHeight = bgImg.height;
                                            sWidth = bgImg.height * canvasRatio;
                                            sx = (bgImg.width - sWidth) / 2;
                                            sy = 0;
                                        } else {
                                            // Image is taller, use width as constraint
                                            sWidth = bgImg.width;
                                            sHeight = bgImg.width / canvasRatio;
                                            sx = 0;
                                            sy = (bgImg.height - sHeight) / 2;
                                        }
                                        
                                        tempCtx.drawImage(
                                            bgImg, 
                                            sx, sy, sWidth, sHeight,
                                            0, 0, tempCanvas.width, tempCanvas.height
                                        );
                                        tempCtx.drawImage(canvas, 0, 0);
                                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                                        ctx.drawImage(tempCanvas, 0, 0);
                                    }
                                    resolve();
                                };
                                bgImg.onerror = () => {
                                    console.error("Error loading background image");
                                    resolve();
                                };
                                bgImg.src = selectedBackground;
                            });
                        }

                        const transformedImageUrl = canvas.toDataURL("image/png");
                        await new Promise<void>((resolve) => {
                            storeReference?.transaction(() => {
                                storeReference?.setCell("images", `${rowIds[i]}`, "transformedImageUrl", transformedImageUrl);
                                storeReference?.setCell("images", `${rowIds[i]}`, "width", canvas.width);
                                storeReference?.setCell("images", `${rowIds[i]}`, "height", canvas.height);
                                storeReference?.setCell("images", `${rowIds[i]}`, "mediaType", "image/png");
                                resolve();
                            });
                        });
                    }

                    // Clean up WebGPU resources - only dispose tensors
                    output[0].dispose();
                    pixel_values.dispose();
                } catch (error) {
                    console.error("Error processing image:", error);
                    continue;
                }
            }
            setIsProcessingComplete(true);
            setShowProcessed(true);
            return true;
        } catch (error) {
            console.error("Error in processImages:", error);
            return false;
        } finally {
            setIsProcessing(false);
        }
    }, [rowIds, selectedColor, storeReference, useBackgroundImage, selectedBackground]);

    // Effect to load the model
    useEffect(() => {
        const loadModel = async () => {
            try {
                // Store original console methods
                const originalConsole = {
                    log: console.log,
                    warn: console.warn,
                    error: console.error,
                    info: console.info
                };

                // Override all console methods to filter sensitive information
                const sensitivePatterns = [
                    /github\.com/i,
                    /huggingface/i,
                    /transformers/i,
                    /model/i,
                    /RMBG/i,
                    /briaai/i,
                    /pretrained/i,
                    /loading/i,
                    /http/i,
                    /processor/i
                ];

                const filterConsoleOutput = (method: 'log' | 'warn' | 'error' | 'info') => 
                    (...args: any[]) => {
                        const shouldLog = !args.some(arg => 
                            sensitivePatterns.some(pattern => 
                                String(arg).match(pattern)
                            )
                        );
                        if (shouldLog) {
                            originalConsole[method].apply(console, args);
                        }
                    };

                // Apply filters to all console methods
                console.log = filterConsoleOutput('log');
                console.warn = filterConsoleOutput('warn');
                console.error = filterConsoleOutput('error');
                console.info = filterConsoleOutput('info');

                const modelId = process.env.NEXT_PUBLIC_MODEL_ID!;
                
                try {
                    modelRef.current = await AutoModel.from_pretrained(modelId, {
                        device: typeof window !== 'undefined' && 'gpu' in navigator ? 'webgpu' : 'cpu'
                    }).catch((e) => {
                        handleModelError(e);
                        return null;
                    });
                    
                    if (!modelRef.current) return;

                    processorRef.current = await AutoProcessor.from_pretrained(modelId, {
                        device: typeof window !== 'undefined' && 'gpu' in navigator ? 'webgpu' : 'cpu'
                    }).catch((e) => {
                        handleModelError(e);
                        return null;
                    });
                    
                    if (!processorRef.current) return;

                    // Restore original console methods
                    console.log = originalConsole.log;
                    console.warn = originalConsole.warn;
                    console.error = originalConsole.error;
                    console.info = originalConsole.info;

                    setIsLoadingModel(false);
                } catch (e) {
                    handleModelError(e);
                    return;
                }
            } catch (error) {
                handleModelError(error);
            }
        };

        loadModel();

        return () => {
            // Cleanup
            if (modelRef.current) {
                modelRef.current = null;
            }
            if (processorRef.current) {
                processorRef.current = null;
            }
        };
    }, [storeReference]);

    // Effect to handle image processing
    useEffect(() => {
        const processIfNeeded = async () => {
            if (!isLoadingModel && autoProcessRef.current && rowIds.length > 0) {
                setIsProcessing(true);
                await processImages();
            }
        };

        processIfNeeded();
    }, [rowIds, processImages, isLoadingModel]);

    // Cleanup effect when component unmounts
    useEffect(() => {
        return () => {
            // Reset all states
            setIsProcessing(false);
            setIsProcessingComplete(false);
            setShowProcessed(false);
            setSelectedColor('transparent');
            setIsCustomColorActive(false);
            setIsCropModalOpen(false);
            setIsMaskEditorOpen(false);
            setIsEditToolsOpen(false);
            setCrop(undefined);
            setCompletedCrop(undefined);
            setSelectedBackground(null);
            setUseBackgroundImage(false);
            setCustomBackgroundUploader(null);
            
            // Clear the stored image data
            if (storeReference?.hasTable("images")) {
                storeReference.transaction(() => {
                    storeReference.delTable("images");
                });
            }
            
            // Clean up WebGPU resources if they exist
            if (modelRef.current) {
                // The model might have internal tensors or resources to clean up
                modelRef.current = null;
            }
            if (processorRef.current) {
                processorRef.current = null;
            }
        };
    }, [storeReference]);

    const downloadImage = async () => {
        const rowId = rowIds[0];
        const name = storeReference?.getCell("images", rowId, "name") as string;
        const transformedImageUrl = storeReference?.getCell("images", rowId, "transformedImageUrl") as string;
        
        // Create a temporary canvas
        const canvas = document.createElement('canvas');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                // If using background image and not transparent
                if (useBackgroundImage && selectedBackground) {
                    const bgImg = new Image();
                    bgImg.onload = () => {
                        // Draw background image with cover/contain logic
                        const imgRatio = bgImg.width / bgImg.height;
                        const canvasRatio = canvas.width / canvas.height;
                        let sx, sy, sWidth, sHeight;
                        
                        if (imgRatio > canvasRatio) {
                            // Image is wider, use height as constraint
                            sHeight = bgImg.height;
                            sWidth = bgImg.height * canvasRatio;
                            sx = (bgImg.width - sWidth) / 2;
                            sy = 0;
                        } else {
                            // Image is taller, use width as constraint
                            sWidth = bgImg.width;
                            sHeight = bgImg.width / canvasRatio;
                            sx = 0;
                            sy = (bgImg.height - sHeight) / 2;
                        }
                        
                        ctx.drawImage(
                            bgImg, 
                            sx, sy, sWidth, sHeight,
                            0, 0, canvas.width, canvas.height
                        );
                        
                        // Draw the image with transparency
                        ctx.drawImage(img, 0, 0);
                        
                        // Convert to blob and download
                        canvas.toBlob((blob) => {
                            if (blob) {
                                saveAs(blob, name);
                            }
                        }, 'image/png');
                    };
                    
                    bgImg.src = selectedBackground;
                } else {
                    // Fill background with selected color if not transparent
                    if (selectedColor !== 'transparent') {
                        ctx.fillStyle = selectedColor;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    
                    // Draw the image with transparency
                    ctx.drawImage(img, 0, 0);
                    
                    // Convert to blob and download
                    canvas.toBlob((blob) => {
                        if (blob) {
                            saveAs(blob, name);
                        }
                    }, 'image/png');
                }
            }
        };
        
        img.src = transformedImageUrl;
    };

    const handleNewUpload = () => {
        // Clear previous image settings from localStorage if there were any
        if (storeReference?.hasTable("images") && rowIds.length > 0) {
            try {
                rowIds.forEach(id => {
                    localStorage.removeItem(`image-settings-${id}`);
                });
            } catch (error) {
                console.error("Error clearing image settings from localStorage:", error);
            }
        }
        
        storeReference?.transaction(() => {
            storeReference?.delTable("images");
        });
        setShowProcessed(false);
        setSelectedColor('transparent');
        setIsProcessingComplete(false);
        setSelectedBackground(null);
        setUseBackgroundImage(false);
        setEnableDrag(false);
        setImagePosition({ x: 0, y: 0 });
        setIsResizeMode(false);
        setImageScale(1);
    };
    
    const resetImageTransform = () => {
        setImagePosition({ x: 0, y: 0 });
        setImageScale(1);
        
        // Reset stored values in localStorage
        if (storeReference?.hasTable("images") && rowIds.length > 0) {
            try {
                const imageId = rowIds[0];
                localStorage.removeItem(`image-settings-${imageId}`);
            } catch (error) {
                console.error("Error removing image settings from localStorage:", error);
            }
        }
    };
    
    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!enableDrag) return;
        setDragStart({
            x: e.clientX - imagePosition.x,
            y: e.clientY - imagePosition.y
        });
    };
    
    const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!enableDrag || !dragStart) return;
        setImagePosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };
    
    const handleDragEnd = () => {
        if (!enableDrag) return;
        setDragStart(null);
        
        // Save position to localStorage
        if (storeReference?.hasTable("images") && rowIds.length > 0) {
            try {
                const imageId = rowIds[0];
                
                // Get current settings or initialize empty object
                let currentSettings = {};
                try {
                    const savedSettingsJson = localStorage.getItem(`image-settings-${imageId}`);
                    if (savedSettingsJson) {
                        currentSettings = JSON.parse(savedSettingsJson);
                    }
                } catch (error) {
                    console.error("Error parsing existing settings:", error);
                }
                
                const updatedSettings = {
                    ...currentSettings,
                    position: imagePosition
                };
                
                localStorage.setItem(`image-settings-${imageId}`, JSON.stringify(updatedSettings));
            } catch (error) {
                console.error("Error saving position to localStorage:", error);
            }
        }
    };

    // Replace the handleWheel function with a cursor-based resize function
    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!isResizeMode) return;
        
        // Record starting position
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        setDragStart({
            x: clientX,
            y: clientY
        });
        e.preventDefault();
    };

    const handleResizeMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!isResizeMode || !dragStart) return;
        
        // Get current position
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        // Calculate movement from drag start position
        const deltaX = clientX - dragStart.x;
        const deltaY = clientY - dragStart.y;
        
        // Use vertical movement to determine resize direction
        // Move up = increase size, Move down = decrease size
        const scaleFactor = 0.01;
        const deltaScale = -deltaY * scaleFactor;
        
        // Apply scale change with bounds
        const newScale = Math.max(0.2, Math.min(3, imageScale + deltaScale));
        setImageScale(newScale);
        
        // Update drag start for continuous movement
        setDragStart({
            x: clientX,
            y: clientY
        });
        
        // Save scale to localStorage
        if (storeReference?.hasTable("images") && rowIds.length > 0) {
            try {
                const imageId = rowIds[0];
                
                // Get current settings or initialize empty object
                let currentSettings = {};
                try {
                    const savedSettingsJson = localStorage.getItem(`image-settings-${imageId}`);
                    if (savedSettingsJson) {
                        currentSettings = JSON.parse(savedSettingsJson);
                    }
                } catch (error) {
                    console.error("Error parsing existing settings:", error);
                }
                
                const updatedSettings = {
                    ...currentSettings,
                    scale: newScale
                };
                
                localStorage.setItem(`image-settings-${imageId}`, JSON.stringify(updatedSettings));
            } catch (error) {
                console.error("Error saving scale to localStorage:", error);
            }
        }
        
        e.preventDefault();
    };

    const handleResizeEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!isResizeMode) return;
        setDragStart(null);
        e.preventDefault();
    };

    const downloadCroppedImage = useCallback(() => {
        if (!imageRef.current) return;

        // If in drag mode or resize mode, just download the positioned/resized image
        if (enableDrag || isResizeMode) {
            // Get the crop container element
            const cropContainer = document.getElementById('crop-container');
            if (!cropContainer) return;

            // Create a new canvas for the positioned/resized image
            const resultCanvas = document.createElement('canvas');
            const resultCtx = resultCanvas.getContext('2d');
            if (!resultCtx) return;

            // Get dimensions from the crop container
            const cropRect = cropContainer.getBoundingClientRect();
            resultCanvas.width = cropRect.width;
            resultCanvas.height = cropRect.height;

            // Create a temporary canvas to render the entire frame with background
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;

            // Set the temporary canvas size to the crop container size
            tempCanvas.width = cropRect.width;
            tempCanvas.height = cropRect.height;

            // First, paint the background to the temporary canvas
            if (useBackgroundImage && selectedBackground) {
                // Using a background image
                const bgImg = new Image();
                
                bgImg.onload = () => {
                    // Fill the background with the image
                    const imgRatio = bgImg.width / bgImg.height;
                    const canvasRatio = tempCanvas.width / tempCanvas.height;
                    let sx, sy, sWidth, sHeight;
                    
                    if (imgRatio > canvasRatio) {
                        // Image is wider, use height as constraint
                        sHeight = bgImg.height;
                        sWidth = bgImg.height * canvasRatio;
                        sx = (bgImg.width - sWidth) / 2;
                        sy = 0;
                    } else {
                        // Image is taller, use width as constraint
                        sWidth = bgImg.width;
                        sHeight = bgImg.width / canvasRatio;
                        sx = 0;
                        sy = (bgImg.height - sHeight) / 2;
                    }
                    
                    tempCtx.drawImage(
                        bgImg, 
                        sx, sy, sWidth, sHeight,
                        0, 0, tempCanvas.width, tempCanvas.height
                    );
                    
                    // Draw the positioned/resized image
                    const image = imageRef.current!;
                    const imageRect = image.getBoundingClientRect();
                    
                    // Calculate center of the container
                    const centerX = cropRect.width / 2;
                    const centerY = cropRect.height / 2;
                    
                    // Calculate position and dimensions for the image
                    const actualWidth = isResizeMode ? imageRect.width : imageRect.width;
                    const actualHeight = isResizeMode ? imageRect.height : imageRect.height;
                    const posX = centerX - actualWidth / 2 + imagePosition.x;
                    const posY = centerY - actualHeight / 2 + imagePosition.y;
                    
                    tempCtx.drawImage(
                        image,
                        posX, posY, actualWidth, actualHeight
                    );
                    
                    // Copy the entire canvas to the result
                    resultCtx.drawImage(tempCanvas, 0, 0);
                    
                    // Convert to blob and save
                    resultCanvas.toBlob((blob) => {
                        if (!blob) return;
                        const name = storeReference?.getCell("images", rowIds[0], "name") as string;
                        const filename = name.replace(/\.(png|jpg|jpeg|gif)$/i, '');
                        saveAs(blob, `${filename}_${isResizeMode ? 'resized' : 'positioned'}.png`);
                        setIsCropModalOpen(false);
                        setEnableDrag(false);
                        setIsResizeMode(false);
                        // Don't reset the scale to preserve it in localStorage
                        // setImageScale(1);
                    }, 'image/png');
                };
                
                bgImg.src = selectedBackground;
            } else {
                // Using a solid color background
                tempCtx.fillStyle = selectedColor === 'transparent' ? 
                    'rgba(0, 0, 0, 0)' : selectedColor;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                // Draw the positioned/resized image
                const image = imageRef.current;
                const imageRect = image.getBoundingClientRect();
                
                // Calculate center of the container
                const centerX = cropRect.width / 2;
                const centerY = cropRect.height / 2;
                
                // Calculate position and dimensions for the image
                const actualWidth = isResizeMode ? imageRect.width : imageRect.width;
                const actualHeight = isResizeMode ? imageRect.height : imageRect.height;
                const posX = centerX - actualWidth / 2 + imagePosition.x;
                const posY = centerY - actualHeight / 2 + imagePosition.y;
                
                tempCtx.drawImage(
                    image,
                    posX, posY, actualWidth, actualHeight
                );
                
                // Copy the entire canvas to the result
                resultCtx.drawImage(tempCanvas, 0, 0);
                
                // Convert to blob and save
                resultCanvas.toBlob((blob) => {
                    if (!blob) return;
                    const name = storeReference?.getCell("images", rowIds[0], "name") as string;
                    const filename = name.replace(/\.(png|jpg|jpeg|gif)$/i, '');
                    saveAs(blob, `${filename}_${isResizeMode ? 'resized' : 'positioned'}.png`);
                    setIsCropModalOpen(false);
                    setEnableDrag(false);
                    setIsResizeMode(false);
                    // Don't reset the scale to preserve it in localStorage
                    // setImageScale(1);
                }, 'image/png');
            }
            return;
        }

        // If no crop has been made or crop is very small (likely unintentional), download the full image
        if (!completedCrop || (completedCrop.width < 5 && completedCrop.height < 5)) {
            // Get the crop container element
            const cropContainer = document.getElementById('crop-container');
            if (!cropContainer) return;

            // Create a new canvas for the full image
            const resultCanvas = document.createElement('canvas');
            const resultCtx = resultCanvas.getContext('2d');
            if (!resultCtx) return;

            // Get dimensions from the crop container
            const cropRect = cropContainer.getBoundingClientRect();
            resultCanvas.width = cropRect.width;
            resultCanvas.height = cropRect.height;

            // Create a temporary canvas to render the entire frame with background
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;

            // Set the temporary canvas size to the crop container size
            tempCanvas.width = cropRect.width;
            tempCanvas.height = cropRect.height;

            // First, paint the background to the temporary canvas
            if (useBackgroundImage && selectedBackground) {
                // Using a background image
                const bgImg = new Image();
                
                bgImg.onload = () => {
                    // Fill the background with the image
                    const imgRatio = bgImg.width / bgImg.height;
                    const canvasRatio = tempCanvas.width / tempCanvas.height;
                    let sx, sy, sWidth, sHeight;
                    
                    if (imgRatio > canvasRatio) {
                        // Image is wider, use height as constraint
                        sHeight = bgImg.height;
                        sWidth = bgImg.height * canvasRatio;
                        sx = (bgImg.width - sWidth) / 2;
                        sy = 0;
                    } else {
                        // Image is taller, use width as constraint
                        sWidth = bgImg.width;
                        sHeight = bgImg.width / canvasRatio;
                        sx = 0;
                        sy = (bgImg.height - sHeight) / 2;
                    }
                    
                    tempCtx.drawImage(
                        bgImg, 
                        sx, sy, sWidth, sHeight,
                        0, 0, tempCanvas.width, tempCanvas.height
                    );
                    
                    // Then draw the image
                    const image = imageRef.current!;
                    const imageRect = image.getBoundingClientRect();
                    
                    // Calculate position of the image within the container, including position offset and scale
                    const imageX = (cropRect.width - imageRect.width) / 2 + imagePosition.x;
                    const imageY = (cropRect.height - imageRect.height) / 2 + imagePosition.y;
                    
                    tempCtx.drawImage(
                        image,
                        imageX, imageY, imageRect.width, imageRect.height
                    );
                    
                    // Copy the entire canvas to the result
                    resultCtx.drawImage(tempCanvas, 0, 0);
                    
                    // Convert to blob and save
                    resultCanvas.toBlob((blob) => {
                        if (!blob) return;
                        const name = storeReference?.getCell("images", rowIds[0], "name") as string;
                        const filename = name.replace(/\.(png|jpg|jpeg|gif)$/i, '');
                        saveAs(blob, `${filename}_full.png`);
                        setIsCropModalOpen(false);
                        setEnableDrag(false);
                        setIsResizeMode(false);
                        // Don't reset the scale to preserve it in localStorage
                        // setImageScale(1);
                    }, 'image/png');
                };
                
                bgImg.src = selectedBackground;
            } else {
                // Using a solid color background
                tempCtx.fillStyle = selectedColor === 'transparent' ? 
                    'rgba(0, 0, 0, 0)' : selectedColor;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                // Draw the image
                const image = imageRef.current;
                const imageRect = image.getBoundingClientRect();
                
                // Calculate position of the image within the container, including position offset and scale
                const imageX = (cropRect.width - imageRect.width) / 2 + imagePosition.x;
                const imageY = (cropRect.height - imageRect.height) / 2 + imagePosition.y;
                
                tempCtx.drawImage(
                    image,
                    imageX, imageY, imageRect.width, imageRect.height
                );
                
                // Copy the entire canvas to the result
                resultCtx.drawImage(tempCanvas, 0, 0);
                
                // Convert to blob and save
                resultCanvas.toBlob((blob) => {
                    if (!blob) return;
                    const name = storeReference?.getCell("images", rowIds[0], "name") as string;
                    const filename = name.replace(/\.(png|jpg|jpeg|gif)$/i, '');
                    saveAs(blob, `${filename}_full.png`);
                    setIsCropModalOpen(false);
                    setEnableDrag(false);
                    setIsResizeMode(false);
                    // Don't reset the scale to preserve it in localStorage
                    // setImageScale(1);
                }, 'image/png');
            }
        } else {
            // Regular crop handling - existing code for when crop is actually selected
            // Get the crop container element
            const cropContainer = document.getElementById('crop-container');
            if (!cropContainer) return;

            // Create a new canvas for the cropped result
            const resultCanvas = document.createElement('canvas');
            const resultCtx = resultCanvas.getContext('2d');
            if (!resultCtx) return;

            // Set dimensions based on crop selection
            resultCanvas.width = completedCrop?.width || 0;
            resultCanvas.height = completedCrop?.height || 0;

            // Create a temporary canvas to render the entire frame with background
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;

            // Set the temporary canvas size to the crop container size
            const cropRect = cropContainer.getBoundingClientRect();
            tempCanvas.width = cropRect.width;
            tempCanvas.height = cropRect.height;

            // First, paint the background to the temporary canvas
            if (useBackgroundImage && selectedBackground) {
                // Using a background image
                const bgImg = new Image();
                
                bgImg.onload = () => {
                    // Fill the background with the image
                    const imgRatio = bgImg.width / bgImg.height;
                    const canvasRatio = tempCanvas.width / tempCanvas.height;
                    let sx, sy, sWidth, sHeight;
                    
                    if (imgRatio > canvasRatio) {
                        // Image is wider, use height as constraint
                        sHeight = bgImg.height;
                        sWidth = bgImg.height * canvasRatio;
                        sx = (bgImg.width - sWidth) / 2;
                        sy = 0;
                    } else {
                        // Image is taller, use width as constraint
                        sWidth = bgImg.width;
                        sHeight = bgImg.width / canvasRatio;
                        sx = 0;
                        sy = (bgImg.height - sHeight) / 2;
                    }
                    
                    tempCtx.drawImage(
                        bgImg, 
                        sx, sy, sWidth, sHeight,
                        0, 0, tempCanvas.width, tempCanvas.height
                    );
                    
                    // Then draw the image with its current position and scale
                    const image = imageRef.current!;
                    const imageRect = image.getBoundingClientRect();
                    
                    // Calculate position of the image within the container, including position offset
                    const imageX = (cropRect.width - imageRect.width) / 2 + imagePosition.x;
                    const imageY = (cropRect.height - imageRect.height) / 2 + imagePosition.y;
                    
                    tempCtx.drawImage(
                        image,
                        imageX, imageY, imageRect.width, imageRect.height
                    );
                    
                    // Finally, draw the cropped portion to the result canvas
                    resultCtx.drawImage(
                        tempCanvas,
                        completedCrop?.x || 0, completedCrop?.y || 0, completedCrop?.width || 0, completedCrop?.height || 0,
                        0, 0, completedCrop?.width || 0, completedCrop?.height || 0
                    );
                    
                    // Convert to blob and save
                    resultCanvas.toBlob((blob) => {
                        if (!blob) return;
                        const name = storeReference?.getCell("images", rowIds[0], "name") as string;
                        const filename = name.replace(/\.(png|jpg|jpeg|gif)$/i, '');
                        saveAs(blob, `${filename}_cropped.png`);
                        setIsCropModalOpen(false);
                        setEnableDrag(false);
                        setIsResizeMode(false);
                        // Don't reset the scale to preserve it in localStorage
                        // setImageScale(1);
                    }, 'image/png');
                };
                
                bgImg.src = selectedBackground;
            } else {
                // Using a solid color background
                tempCtx.fillStyle = selectedColor === 'transparent' ? 
                    'rgba(0, 0, 0, 0)' : selectedColor;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                // Draw the image with its current position and scale
                const image = imageRef.current;
                const imageRect = image.getBoundingClientRect();
                
                // Calculate position of the image within the container, including position offset
                const imageX = (cropRect.width - imageRect.width) / 2 + imagePosition.x;
                const imageY = (cropRect.height - imageRect.height) / 2 + imagePosition.y;
                
                tempCtx.drawImage(
                    image,
                    imageX, imageY, imageRect.width, imageRect.height
                );
                
                // Draw the cropped portion to the result canvas
                resultCtx.drawImage(
                    tempCanvas,
                    completedCrop?.x || 0, completedCrop?.y || 0, completedCrop?.width || 0, completedCrop?.height || 0,
                    0, 0, completedCrop?.width || 0, completedCrop?.height || 0
                );
                
                // Convert to blob and save
                resultCanvas.toBlob((blob) => {
                    if (!blob) return;
                    const name = storeReference?.getCell("images", rowIds[0], "name") as string;
                    const filename = name.replace(/\.(png|jpg|jpeg|gif)$/i, '');
                    saveAs(blob, `${filename}_cropped.png`);
                    setIsCropModalOpen(false);
                    setEnableDrag(false);
                    setIsResizeMode(false);
                    // Don't reset the scale to preserve it in localStorage
                    // setImageScale(1);
                }, 'image/png');
            }
        }
    }, [completedCrop, storeReference, rowIds, selectedColor, useBackgroundImage, selectedBackground, imagePosition, enableDrag, isResizeMode]);

    // Function to load background image dimensions when crop modal opens
    const loadBackgroundImageDimensions = useCallback(() => {
        if (useBackgroundImage && selectedBackground) {
            const img = new Image();
            img.onload = () => {
                setBackgroundImageDimensions({
                    width: img.width,
                    height: img.height
                });
                backgroundImageRef.current = img;
            };
            img.src = selectedBackground;
        } else {
            setBackgroundImageDimensions(null);
            backgroundImageRef.current = null;
        }
    }, [selectedBackground, useBackgroundImage]);

    // Effect to load background image when crop modal opens
    useEffect(() => {
        if (isCropModalOpen) {
            loadBackgroundImageDimensions();
        }
    }, [isCropModalOpen, loadBackgroundImageDimensions]);

    // Load image position and scale from localStorage when crop modal is opened
    useEffect(() => {
        if (isCropModalOpen && storeReference?.hasTable("images") && rowIds.length > 0) {
            try {
                const imageId = rowIds[0];
                const savedSettingsJson = localStorage.getItem(`image-settings-${imageId}`);
                
                if (savedSettingsJson) {
                    const savedSettings = JSON.parse(savedSettingsJson);
                    
                    if (savedSettings.position) {
                        setImagePosition(savedSettings.position);
                    }
                    
                    if (savedSettings.scale) {
                        setImageScale(savedSettings.scale);
                    }
                }
            } catch (error) {
                console.error("Error loading image settings from localStorage:", error);
            }
        }
    }, [isCropModalOpen, rowIds, storeReference]);

    // Save image position and scale to localStorage when they change
    useEffect(() => {
        if (storeReference?.hasTable("images") && rowIds.length > 0 && (imagePosition.x !== 0 || imagePosition.y !== 0 || imageScale !== 1)) {
            try {
                const imageId = rowIds[0];
                
                // Get current settings or initialize empty object
                let currentSettings = {};
                try {
                    const savedSettingsJson = localStorage.getItem(`image-settings-${imageId}`);
                    if (savedSettingsJson) {
                        currentSettings = JSON.parse(savedSettingsJson);
                    }
                } catch (error) {
                    console.error("Error parsing existing settings:", error);
                }
                
                const updatedSettings = {
                    ...currentSettings,
                    position: imagePosition,
                    scale: imageScale
                };
                
                localStorage.setItem(`image-settings-${imageId}`, JSON.stringify(updatedSettings));
            } catch (error) {
                console.error("Error saving image settings to localStorage:", error);
            }
        }
    }, [imagePosition, imageScale, rowIds, storeReference]);

    // Add a new effect to load image settings when an image is loaded
    useEffect(() => {
        if (storeReference?.hasTable("images") && rowIds.length > 0 && isProcessingComplete) {
            try {
                const imageId = rowIds[0];
                const savedSettingsJson = localStorage.getItem(`image-settings-${imageId}`);
                
                if (savedSettingsJson) {
                    const savedSettings = JSON.parse(savedSettingsJson);
                    
                    if (savedSettings.position) {
                        setImagePosition(savedSettings.position);
                    }
                    
                    if (savedSettings.scale) {
                        setImageScale(savedSettings.scale);
                    }
                }
            } catch (error) {
                console.error("Error loading image settings from localStorage:", error);
            }
        }
    }, [rowIds, storeReference, isProcessingComplete]);

    const handleCustomBackgroundUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setSelectedBackground(result);
            setCustomBackgroundUploader(file);
        };
        reader.readAsDataURL(file);
    }, []);

    const triggerCustomBackgroundUpload = useCallback(() => {
        customBackgroundRef.current?.click();
    }, []);

    const handleImageDataUrl = useCallback((dataUrl: string) => {
        // ... existing code ...
    }, []);

    // Function to open crop editor
    const openCropEditor = useCallback(() => {
        setIsCropModalOpen(true);
        setIsEditToolsOpen(true);
        setActiveEditTab('crop');
    }, []);

    // Function to close all edit tools
    const closeEditTools = useCallback(() => {
        setIsMaskEditorOpen(false);
        setIsCropModalOpen(false);
        setIsEditToolsOpen(false);
    }, []);

    // Handle opening the mask editor
    const openMaskEditor = useCallback(() => {
        setIsMaskEditorOpen(true);
        setIsEditToolsOpen(true);
        setActiveEditTab('mask');
    }, []);

    // Handle saving the edited mask
    const saveMaskEdit = useCallback((maskDataUrl: string) => {
        setEditedMask(maskDataUrl);
        
        // Update the transformed image URL with the edited mask
        if (storeReference && rowIds.length > 0) {
            storeReference.transaction(() => {
                storeReference?.setCell("images", `${rowIds[0]}`, "transformedImageUrl", maskDataUrl);
            });
        }
        
        setIsMaskEditorOpen(false);
    }, [storeReference, rowIds]);

    if (error) {
        return (
            <div className='space-y-3'>
                <h2 className="mb-2 text-lg text-danger">Unable to Load Resources</h2>
                <div className="rounded-xl border border-danger/20 bg-dangerForeground px-4 py-3">
                    <p className='text-danger'>Please refresh the page and try again. If the problem persists, contact support.</p>
                </div>
            </div>
        );
    }
    return (
        <div className='space-y-4'>
            <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-[640px] flex flex-col items-center">
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-4">
                        {storeReference?.hasTable("images") && rowIds.length > 0 && isProcessingComplete && (
                            <div className="w-full mb-4 overflow-hidden rounded-xl shadow-sm bg-gradient-to-r from-[#6C5CE7]/5 to-[#5a4bd4]/5 backdrop-blur-sm border border-[#6C5CE7]/10">
                                <div className="p-3">
                                    {/* Top Row: Header, Tabs & Controls */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                                        {/* Left Side: Title & Tabs */}
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                                <span>Background</span>
                                            </h3>
                                            
                                            {/* Tabs */}
                                            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => setUseBackgroundImage(false)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-sm font-medium flex items-center gap-1 transition-all duration-300",
                                                        !useBackgroundImage 
                                                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm" 
                                                            : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    )}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="2" 
                                                        className="size-3.5"
                                                    >
                                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                                    </svg>
                                                    <span>Color</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setUseBackgroundImage(true)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-sm font-medium flex items-center gap-1 transition-all duration-300",
                                                        useBackgroundImage 
                                                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm" 
                                                            : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    )}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="2" 
                                                        className="size-3.5"
                                                    >
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                        <polyline points="21 15 16 10 5 21"></polyline>
                                                    </svg>
                                                    <span>Image</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Right Side: Preview Toggle & Actions */}
                                        <div className="flex items-center gap-3 mt-1 sm:mt-0">
                                            {/* Upload Button - Always visible */}
                                            {useBackgroundImage && (
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 invisible">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                                        </svg>
                                                        <span>Action</span>
                                                    </h3>
                                                    <button
                                                        onClick={triggerCustomBackgroundUpload}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                                                    >
                                                        <LuUpload className="size-3.5" />
                                                        <span>Upload Background</span>
                                                        <input
                                                            ref={customBackgroundRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleCustomBackgroundUpload}
                                                            className="hidden"
                                                            aria-label="Upload custom background"
                                                        />
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {/* Preview Toggle with Title */}
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                    <span>Preview</span>
                                                </h3>
                                                <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-0.5 shadow-sm">
                                                    <button
                                                        onClick={() => setShowProcessed(false)}
                                                        className={cn(
                                                            "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300",
                                                            !showProcessed 
                                                                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm" 
                                                                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        )}
                                                    >
                                                        Before
                                                    </button>
                                                    <button
                                                        onClick={() => setShowProcessed(true)}
                                                        className={cn(
                                                            "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300",
                                                            showProcessed 
                                                                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm" 
                                                                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        )}
                                                    >
                                                        After
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Content Section - Color Picker & Image Backgrounds */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                                        {!useBackgroundImage ? (
                                            <div className="flex flex-wrap items-center gap-3">
                                                {BACKGROUND_COLORS.map(({ id, color }) => (
                                                    <button
                                                        key={id}
                                                        onClick={() => {
                                                            setSelectedColor(color);
                                                            setIsCustomColorActive(false);
                                                        }}
                                                        className={cn(
                                                            "group relative size-10 rounded-full transition-all duration-300 hover:scale-110",
                                                            selectedColor === color && !isCustomColorActive
                                                                ? "ring-2 ring-gray-900 dark:ring-white shadow-lg scale-110" 
                                                                : "ring-2 ring-gray-200 dark:ring-gray-600 hover:ring-gray-300 dark:hover:ring-gray-500 shadow-sm",
                                                            id === 'transparent' && "bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] bg-repeat"
                                                        )}
                                                        style={{
                                                            backgroundColor: color === 'transparent' ? 'transparent' : color,
                                                        }}
                                                        aria-label={`Select ${id} background`}
                                                    >
                                                        {/* Checkmark for selected color */}
                                                        {selectedColor === color && !isCustomColorActive && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <svg className="size-5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}

                                                <div className="relative">
                                                    <button
                                                        onClick={() => {
                                                            setIsCustomColorActive(true);
                                                            setSelectedColor(customColor);
                                                            customColorRef.current?.click();
                                                        }}
                                                        className={cn(
                                                            "group relative size-10 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center",
                                                            isCustomColorActive
                                                                ? "ring-2 ring-gray-900 dark:ring-white shadow-lg scale-110" 
                                                                : "ring-2 ring-gray-200 dark:ring-gray-600 hover:ring-gray-300 dark:hover:ring-gray-500 shadow-sm"
                                                        )}
                                                        style={{ backgroundColor: customColor }}
                                                        aria-label="Select custom color"
                                                    >
                                                        {!isCustomColorActive && (
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="size-6 drop-shadow-md">
                                                                <path d="M12 2v20M2 12h20"></path>
                                                            </svg>
                                                        )}
                                                        {isCustomColorActive && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <svg className="size-5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </button>
                                                    <input
                                                        ref={customColorRef}
                                                        type="color"
                                                        value={customColor}
                                                        onChange={(e) => {
                                                            setCustomColor(e.target.value);
                                                            setSelectedColor(e.target.value);
                                                            setIsCustomColorActive(true);
                                                        }}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        aria-label="Custom color picker"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <BackgroundSelector 
                                                    selectedBackground={selectedBackground}
                                                    onSelectBackground={(bg) => setSelectedBackground(bg)}
                                                    rightElement={null}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        {...getRootProps()}
                        className={cn(
                            "relative aspect-[3/2] w-full",
                            isDragActive && "pointer-events-none",
                            enableDrag && isProcessingComplete && "cursor-move",
                            isProcessingComplete && !enableDrag && "pointer-events-none"
                        )}
                    >
                        {(isLoadingModel || isProcessing) && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                                <div className="flex items-center gap-3 text-[#6C5CE7]">
                                    <LuLoader2 className="size-5 animate-spin" />
                                    <span className="font-medium">Wait, we&apos;re working on it.</span>
                                </div>
                                <div className="mt-2 text-sm text-[#6C5CE7]/70">
                                    Loading our AI model for the best results...
                                </div>
                            </div>
                        )}
                        <div 
                            className={cn(
                            "flex size-full flex-col items-center justify-center rounded-xl border-2 border-white bg-white shadow-lg transition-all duration-300 overflow-hidden",
                            isDragAccept ? "border-success bg-success/5" :
                                isDragReject ? "border-danger bg-danger/5" :
                                    isDragActive ? "border-[#6C5CE7] bg-[#6C5CE7]/5" :
                                        "bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] bg-repeat",
                            storeReference?.hasTable("images") && rowIds.length > 0 && "bg-none",
                            (isLoadingModel || isProcessing) && "filter blur-[2px] transition-all duration-300",
                            enableDrag && "relative"
                        )}
                            onMouseDown={isProcessingComplete && enableDrag ? handleDragStart : undefined}
                            onMouseMove={isProcessingComplete && enableDrag ? handleDragMove : undefined}
                            onMouseUp={isProcessingComplete && enableDrag ? handleDragEnd : undefined}
                            onMouseLeave={isProcessingComplete && enableDrag ? handleDragEnd : undefined}
                            onTouchStart={handleResizeStart}
                        style={
                            storeReference?.hasTable("images") && rowIds.length > 0
                                ? {
                                    backgroundImage: `${selectedColor === 'transparent' && !useBackgroundImage ? 
                                        `url(${showProcessed 
                                        ? storeReference?.getCell("images", rowIds[0], "transformedImageUrl") 
                                        : storeReference?.getCell("images", rowIds[0], "imageUrl")}), url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')` : 
                                        useBackgroundImage && selectedBackground ? 
                                        `url(${showProcessed 
                                            ? storeReference?.getCell("images", rowIds[0], "transformedImageUrl") 
                                            : storeReference?.getCell("images", rowIds[0], "imageUrl")}), url(${selectedBackground})` :
                                        `url(${showProcessed 
                                            ? storeReference?.getCell("images", rowIds[0], "transformedImageUrl") 
                                            : storeReference?.getCell("images", rowIds[0], "imageUrl")})`}`,
                                    backgroundSize: selectedColor === 'transparent' && !useBackgroundImage ? 'contain, 10px 10px' : 
                                                    useBackgroundImage && selectedBackground ? 'contain, cover' : 'contain',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: selectedColor === 'transparent' && !useBackgroundImage ? 'no-repeat, repeat' : 
                                                    useBackgroundImage && selectedBackground ? 'no-repeat, no-repeat' : 'no-repeat',
                                    backgroundColor: selectedColor === 'transparent' || useBackgroundImage ? 'transparent' : selectedColor
                                }
                                : {}
                        }
                        >
                            <input {...getInputProps()} className="hidden" accept="image/jpeg,image/png,image/webp" aria-hidden="true" />
                            {(!storeReference?.hasTable("images") || rowIds.length === 0) && (
                                <>
                                    <div className="py-6">
                                        <button
                                            type="button"
                                            disabled={isLoadingModel}
                                            className={cn(
                                                "inline-flex w-fit items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#5a4bd4] px-6 py-3 text-white transition-all duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7] focus-visible:ring-offset-2",
                                                isLoadingModel && "opacity-70 cursor-not-allowed"
                                            )}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                {isLoadingModel ? (
                                                    <LuLoader2 className="size-6 animate-spin" />
                                                ) : (
                                                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6">
                                                        <g clipPath="url(#clip0_8829_13883)">
                                                            <circle cx="12" cy="12" r="12" fillOpacity="0.15"></circle>
                                                            <path d="M18 11H13V6C13 5.73478 12.8946 5.48043 12.7071 5.29289C12.5196 5.10536 12.2652 5 12 5C11.7348 5 11.4804 5.10536 11.2929 5.29289C11.1054 5.48043 11 5.73478 11 6V11H6C5.73478 11 5.48043 11.1054 5.29289 11.2929C5.10536 11.4804 5 11.7348 5 12C5 12.2652 5.10536 12.5196 5.29289 12.7071C5.48043 12.8946 5.73478 13 6 13H11V18C11 18.2652 11.1054 18.5196 11.2929 18.7071C11.4804 18.8946 11.7348 19 12 19C12.2652 19 12.5196 18.8946 12.7071 18.7071C12.8946 18.5196 13 18.2652 13 18V13H18C18.2652 13 18.5196 12.8946 18.7071 12.7071C18.8946 12.5196 19 12.2652 19 12C19 11.7348 18.8946 11.4804 18.7071 11.2929C18.5196 11.1054 18.2652 11 18 11Z"></path>
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_8829_13883">
                                                                <rect width="24" height="24"></rect>
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                )}
                                                <span className="font-semibold">
                                                    {isLoadingModel ? 'Wait, we&apos;re working on it.' : 'Start from a photo'}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {isLoadingModel ? '' : 'Or drop an image here'}
                                    </div>
                                </>
                            )}
                        </div>
                        {isDragActive && (
                            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl bg-white/30 backdrop-blur-sm transition-all duration-300">
                                <div className="text-lg font-semibold text-[#6C5CE7] flex items-center gap-2">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 animate-bounce">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Drop your image here
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {storeReference?.hasTable("images") && rowIds.length > 0 &&
                    <div className="w-full max-w-[640px] flex justify-center mt-6">
                        <div className="flex flex-wrap justify-center gap-3">
                            {!isProcessingComplete ? (
                                <Button
                                    type='button'
                                    onClick={processImages}
                                    disabled={isProcessing || isLoadingModel}
                                    className={cn(
                                        "w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-[#6C5CE7] to-[#5a4bd4] text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] px-8 py-2.5 rounded-full",
                                        (isProcessing || isLoadingModel) && "pl-12"
                                    )}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"/>
                                    {(isProcessing || isLoadingModel) && (
                                        <div className="absolute inset-y-0 left-4 flex items-center">
                                            <LuLoader2 className='size-5 animate-spin' />
                                        </div>
                                    )}
                                    <div className="relative flex items-center">
                                        {!isProcessing && !isLoadingModel && <LuPlay className='mr-2 size-5 transition-transform duration-200 group-hover:scale-110' />}
                                        <span className="font-medium">{(isProcessing || isLoadingModel) ? 'Processing...' : 'Process Image'}</span>
                                    </div>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type='button'
                                        onClick={downloadImage}
                                        className="w-full sm:w-auto group relative overflow-hidden bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-xl font-semibold"
                                    >
                                        <div className="flex items-center justify-center">
                                            <LuDownload className='mr-2 size-4 transition-transform duration-200 group-hover:translate-y-[2px]' />
                                            <span>Download</span>
                                        </div>
                                    </Button>
                                    <Button
                                        type='button'
                                        onClick={() => setIsEditToolsOpen(true)}
                                        className="w-full sm:w-auto group relative overflow-hidden bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-xl font-semibold"
                                    >
                                        <div className="flex items-center justify-center">
                                            <LuSettings className='mr-2 size-4 transition-all duration-200 group-hover:rotate-12' />
                                            <span>Edit Image</span>
                                        </div>
                                    </Button>
                                </>
                            )}
                            <Button
                                type='button'
                                onClick={handleNewUpload}
                                variant="outline"
                                className="w-full sm:w-auto group relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-xl font-semibold"
                            >
                                <div className="flex items-center justify-center">
                                    <div className="mr-2.5 size-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-sm">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                    </div>
                                    <span>Upload New</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                }
            </div>

            {/* Edit Tools Modal */}
            <ModalOverlay
                isOpen={isEditToolsOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeEditTools();
                    }
                }}
                isDismissable
                className={({ isEntering, isExiting }) => `
                fixed inset-0 z-50 overflow-y-auto bg-black/50 flex min-h-full items-center justify-center p-2 sm:p-4 text-center backdrop-blur-sm
                ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
                ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
                `}
            >
                <Modal
                    className={({ isEntering, isExiting }) => `
                    w-full max-w-[calc(100vw-1rem)] sm:max-w-4xl overflow-hidden rounded-2xl bg-white p-3 sm:p-6 text-left align-middle shadow-xl
                    ${isEntering ? 'animate-in zoom-in-95 ease-out duration-300' : ''}
                    ${isExiting ? 'animate-out zoom-out-95 ease-in duration-200' : ''}
                    `}
                >
                    <Dialog className="relative outline-none">
                        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                                    Edit Image
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Choose an editing tool below to modify your image
                                </p>
                            </div>
                            <button
                                onClick={closeEditTools}
                                className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors absolute right-0 top-0"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 mb-4 shadow-sm">
                            <button
                                onClick={() => {
                                    setActiveEditTab('crop');
                                    setIsCropModalOpen(true);
                                    setIsMaskEditorOpen(false);
                                }}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all duration-300",
                                    activeEditTab === 'crop'
                                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm" 
                                        : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                )}
                            >
                                <LuCrop className="size-3.5" />
                                <span>Crop & Resize</span>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveEditTab('mask');
                                    setIsMaskEditorOpen(true);
                                    setIsCropModalOpen(false);
                                }}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all duration-300",
                                    activeEditTab === 'mask'
                                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm" 
                                        : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                )}
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
                                                "flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-sm font-medium transition-all duration-300",
                                                !enableDrag && !isResizeMode
                                                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm" 
                                                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            )}
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
                                                "flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-sm font-medium transition-all duration-300",
                                                enableDrag && !isResizeMode
                                                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm" 
                                                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            )}
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
                                                "flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-sm font-medium transition-all duration-300",
                                                isResizeMode
                                                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm" 
                                                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            )}
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
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5">
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
                                    style={{ 
                                        backgroundColor: useBackgroundImage ? 'transparent' : selectedColor,
                                        backgroundImage: useBackgroundImage && selectedBackground ? `url(${selectedBackground})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <div 
                                        className="relative w-full flex items-center justify-center"
                                        style={{
                                            minHeight: useBackgroundImage && backgroundImageDimensions 
                                                ? 'auto' 
                                                : '40vh',
                                            maxHeight: '70vh',
                                            backgroundColor: useBackgroundImage ? 'transparent' : selectedColor,
                                            backgroundImage: useBackgroundImage && selectedBackground ? `url(${selectedBackground})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            ...(useBackgroundImage && backgroundImageDimensions && {
                                                aspectRatio: `${backgroundImageDimensions.width} / ${backgroundImageDimensions.height}`
                                            })
                                        }}
                                    >
                                        {!enableDrag && !isResizeMode ? (
                                            <ReactCrop
                                                crop={crop}
                                                onChange={(c) => setCrop(c)}
                                                onComplete={(c) => setCompletedCrop(c)}
                                                aspect={undefined}
                                                className="rounded-lg overflow-hidden w-full h-full"
                                                minWidth={0}
                                                minHeight={0}
                                                ruleOfThirds={true}
                                                style={{ margin: 0, padding: 0 }}
                                            >
                                                <div 
                                                    className="flex items-center justify-center relative w-full h-full p-0 m-0" 
                                                    id="crop-container"
                                                    style={{ 
                                                        minHeight: useBackgroundImage && backgroundImageDimensions 
                                                            ? 'auto' 
                                                            : '40vh',
                                                        padding: 0,
                                                        margin: 0,
                                                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                                                        ...(useBackgroundImage && backgroundImageDimensions && {
                                                            aspectRatio: `${backgroundImageDimensions.width} / ${backgroundImageDimensions.height}`
                                                        })
                                                    }}
                                                >
                                                    <img
                                                        ref={imageRef}
                                                        src={storeReference?.getCell("images", rowIds[0], "transformedImageUrl") as string}
                                                        alt="Crop"
                                                        className={cn(
                                                            "max-w-full object-contain relative z-10 p-0 m-0",
                                                            useBackgroundImage && backgroundImageDimensions 
                                                                ? "max-h-full" 
                                                                : "max-h-[40vh] sm:max-h-[60vh]"
                                                        )}
                                                        style={{ 
                                                            padding: 0, 
                                                            margin: 0,
                                                            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`
                                                        }}
                                                    />
                                                </div>
                                            </ReactCrop>
                                        ) : isResizeMode ? (
                                            <div 
                                                className="flex items-center justify-center relative w-full h-full cursor-ns-resize" 
                                                id="crop-container"
                                                style={{ 
                                                    minHeight: useBackgroundImage && backgroundImageDimensions 
                                                        ? 'auto' 
                                                        : '40vh',
                                                    padding: 0,
                                                    margin: 0,
                                                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                                                    ...(useBackgroundImage && backgroundImageDimensions && {
                                                        aspectRatio: `${backgroundImageDimensions.width} / ${backgroundImageDimensions.height}`
                                                    })
                                                }}
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
                                                    src={storeReference?.getCell("images", rowIds[0], "transformedImageUrl") as string}
                                                    alt="Resize"
                                                    className={cn(
                                                        "max-w-full object-contain relative z-10 p-0 m-0",
                                                        useBackgroundImage && backgroundImageDimensions 
                                                            ? "max-h-full" 
                                                            : "max-h-[40vh] sm:max-h-[60vh]"
                                                    )}
                                                    style={{ 
                                                        padding: 0, 
                                                        margin: 0,
                                                        transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                                                        transformOrigin: 'center'
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div 
                                                className="flex items-center justify-center relative w-full h-full cursor-move" 
                                                id="crop-container"
                                                style={{ 
                                                    minHeight: useBackgroundImage && backgroundImageDimensions 
                                                        ? 'auto' 
                                                        : '40vh',
                                                    padding: 0,
                                                    margin: 0,
                                                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                                                    ...(useBackgroundImage && backgroundImageDimensions && {
                                                        aspectRatio: `${backgroundImageDimensions.width} / ${backgroundImageDimensions.height}`
                                                    })
                                                }}
                                                onMouseDown={(e) => {
                                                    setDragStart({
                                                        x: e.clientX - imagePosition.x,
                                                        y: e.clientY - imagePosition.y
                                                    });
                                                    e.preventDefault();
                                                }}
                                                onMouseMove={(e) => {
                                                    if (dragStart) {
                                                        setImagePosition({
                                                            x: e.clientX - dragStart.x,
                                                            y: e.clientY - dragStart.y
                                                        });
                                                        e.preventDefault();
                                                    }
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
                                                    setDragStart({
                                                        x: touch.clientX - imagePosition.x,
                                                        y: touch.clientY - imagePosition.y
                                                    });
                                                    e.preventDefault();
                                                }}
                                                onTouchMove={(e) => {
                                                    if (dragStart) {
                                                        const touch = e.touches[0];
                                                        setImagePosition({
                                                            x: touch.clientX - dragStart.x,
                                                            y: touch.clientY - dragStart.y
                                                        });
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
                                                    src={storeReference?.getCell("images", rowIds[0], "transformedImageUrl") as string}
                                                    alt="Position"
                                                    className={cn(
                                                        "max-w-full object-contain relative z-10 p-0 m-0",
                                                        useBackgroundImage && backgroundImageDimensions 
                                                            ? "max-h-full" 
                                                            : "max-h-[40vh] sm:max-h-[60vh]"
                                                    )}
                                                    style={{ 
                                                        padding: 0, 
                                                        margin: 0,
                                                        transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`
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
                                                Download {isResizeMode ? "Resized" : enableDrag ? "Positioned" : "Cropped"}
                                            </span>
                                        </div>
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Tab Content - Mask Editor */}
                        {activeEditTab === 'mask' && storeReference?.hasTable("images") && rowIds.length > 0 && (
                            <div>
                                <MaskEditor
                                    originalImage={storeReference?.getCell("images", rowIds[0], "imageUrl") as string}
                                    removedBgImage={storeReference?.getCell("images", rowIds[0], "transformedImageUrl") as string}
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

            {/* MaskEditor Modal - Only used when not in combined mode */}
            {isMaskEditorOpen && !isEditToolsOpen && storeReference?.hasTable("images") && rowIds.length > 0 && (
                <MaskEditor
                    originalImage={storeReference?.getCell("images", rowIds[0], "imageUrl") as string}
                    removedBgImage={storeReference?.getCell("images", rowIds[0], "transformedImageUrl") as string}
                    mask={editedMask || undefined}
                    onSave={saveMaskEdit}
                    onClose={() => setIsMaskEditorOpen(false)}
                />
            )}
        </div>
    )
}
