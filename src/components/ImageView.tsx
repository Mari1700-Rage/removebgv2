"use client"

import { useCell } from '@/lib/schema';
import { getSizeTrans } from '@/lib/utils';
import { saveAs } from "file-saver";
import { default as NextImage } from "next/image";
import { LuDownload, LuLoader2, LuRefreshCcw, LuZoomIn, LuZoomOut } from 'react-icons/lu';
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from 'sonner';
import { Button } from './ui/Button';

type Props = {
  rowId: string
}

export default function ImageView({ rowId }: Props) {
  const nameRaw = useCell("images", rowId, "name");
  const imageUrlRaw = useCell("images", rowId, "imageUrl");
  const transformedImageUrlRaw = useCell("images", rowId, "transformedImageUrl");
  const sizeRaw = useCell("images", rowId, "size");
  const heightRaw = useCell("images", rowId, "height");
  const widthRaw = useCell("images", rowId, "width");
  const mediaTypeRaw = useCell("images", rowId, "mediaType");

  // Ensure strings and numbers are correctly typed and defaulted
  const name = typeof nameRaw === "string" ? nameRaw : "image";
  const imageUrl = typeof imageUrlRaw === "string" ? imageUrlRaw : "";
  const transformedImageUrl = typeof transformedImageUrlRaw === "string" ? transformedImageUrlRaw : "";
  const size = typeof sizeRaw === "number" ? getSizeTrans(sizeRaw) : "";
  const height = typeof heightRaw === "number" ? heightRaw : 0;
  const width = typeof widthRaw === "number" ? widthRaw : 0;
  const mediaType = typeof mediaTypeRaw === "string" ? mediaTypeRaw : "";

  // Sanitize filename for Windows-safe download
  const sanitizeFilename = (filename: string) => {
    // Keep alphanumeric, periods, dashes, underscores only
    return filename.replace(/[^\w.-]/g, '_');
  };

  const downloadPNG = async () => {
    const filename = sanitizeFilename(name.replace(/\.(png|jpg|jpeg|gif)$/i, ''));

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous"; // avoid CORS issues when drawing on canvas
        image.src = transformedImageUrl || imageUrl || "";
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Image load failed"));
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        saveAs(blob, `${filename}.png`);
      } else {
        toast.error('Failed to generate image blob');
      }
    } catch (error) {
      toast.error('Failed to load image for download');
      console.error(error);
    }
  };

  if (!imageUrl) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <LuLoader2 className="size-10 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 md:flex-row">
      <div className="group relative max-w-72 cursor-pointer overflow-hidden ">
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent wrapperClass="border border rounded-lg border border-accent">
                <NextImage
                  src={transformedImageUrl || imageUrl}
                  alt={name}
                  width={width}
                  height={height}
                  priority={true}
                />
              </TransformComponent>
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 content-center bg-background/80 p-2 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0">
                <Button type='button' className='text-secondary' onClick={() => zoomIn()}>
                  <LuZoomIn className="size-4" />
                </Button>
                <Button type='button' className='text-secondary' onClick={() => zoomOut()}>
                  <LuZoomOut className="size-4" />
                </Button>
                <Button type='button' className='text-secondary' onClick={() => resetTransform()}>
                  <LuRefreshCcw className="size-4" />
                </Button>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
      <div className="grid grid-cols-2 gap-3 rounded-lg border border-accent p-2 text-primary md:grid-cols-[repeat(2,auto)]">
        <p className="font-bold text-primary">Name:</p>
        <p className="break-words text-secondary">{name}</p>
        <hr className="col-span-full border border-accent" />
        <p className="font-bold text-primary">Size:</p>
        <p className="text-secondary">{size}</p>
        <hr className="col-span-full border border-accent" />
        <p className="font-bold text-primary">dimensions:</p>
        <p className="text-secondary">{`${width} X ${height} px`}</p>
        <hr className="col-span-full border border-accent" />
        <p className="font-bold text-primary">MediaType:</p>
        <p className="text-secondary">{mediaType}</p>
        <hr className="col-span-full border border-accent" />
        <div className="col-start-2 ml-auto">
          {transformedImageUrl &&
            <Button type="button" variant="action" onClick={downloadPNG}>
              <LuDownload className="mr-2 size-4" />
              Download
            </Button>
          }
        </div>
      </div>
    </div>
  );
}
