"use client"
import { useCell } from "@/lib/schema";
import { getSizeTrans } from "@/lib/utils";
import saveAs from "file-saver";
import { default as NextImage } from "next/image";
import { useRouter } from "next/navigation";
import { Button as ButtonAria, Dialog, Modal, ModalOverlay } from "react-aria-components";
import { LuDownload, LuRefreshCcw, LuZoomIn, LuZoomOut } from "react-icons/lu";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from "sonner";

type Props = {
    rowId: string
}

export function ModalImage({ rowId }: Props) {
    const router = useRouter();
    const name = useCell("images", rowId, "name") as string
    const size = getSizeTrans(useCell("images", rowId, "size") as number)
    const mediaType = useCell("images", rowId, "mediaType")
    const imageUrl = useCell("images", rowId, "imageUrl") as string
    const transformedImageUrl = useCell("images", rowId, "transformedImageUrl") as string
    const height = useCell("images", rowId, "height")
    const width = useCell("images", rowId, "width")

    const downloadPNG = async () => {
        const filename = name.replace(/\.(png|jpg|jpeg|gif)$/i, '')
        const img = await new Promise<HTMLImageElement>((resolve) => {
            const image = new Image()
            image.src = transformedImageUrl || imageUrl
            image.onload = () => resolve(image)
        })
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
        if (blob) {
            saveAs(blob, `${filename}.png`)
        } else {
            toast.error('Failed to generate image blob')
        }
    };

    return (
        <ModalOverlay
            isOpen
            onOpenChange={() => router.back()}
            isDismissable
            className={({ isEntering, isExiting }) => `
            fixed inset-0 z-50 overflow-y-auto bg-background/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
            ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
            ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
            `}
        >
            <Modal
                className={({ isEntering, isExiting }) => `
            w-full max-w-md md:max-w-screen-md overflow-hidden rounded-2xl bg-foreground p-6 text-left align-middle shadow-xl
            ${isEntering ? 'animate-in zoom-in-95 ease-out duration-300' : ''}
            ${isExiting ? 'animate-out zoom-out-95 ease-in duration-200' : ''}
            `}
            >
                <Dialog role="dialog" aria-label={name} className="relative outline-none">
                    {({ close }) => (
                        <>
                            <TransformWrapper>
                                {({ zoomIn, zoomOut, resetTransform }) => (
                                    <div className="flex flex-col gap-3">
                                        <TransformComponent contentClass="max-w-[500px]" wrapperClass="self-center rounded-lg border border-accent">
                                            <NextImage
                                                src={transformedImageUrl || imageUrl}
                                                alt={name}
                                                width={width}
                                                height={height}
                                                priority={true}
                                                className="max-h-[500px] object-contain"
                                            />
                                        </TransformComponent>
                                        <div className="flex overflow-hidden rounded-lg border border-accent">
                                            <ButtonAria
                                                onPress={() => zoomIn()}
                                                className="flex w-full items-center justify-center border-r border-accent bg-foreground px-2 py-1 text-sm text-secondary pressed:bg-background pressed:text-primary focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:bg-foreground/50 disabled:text-primary/50 disabled:opacity-50">
                                                <LuZoomIn className="size-4" />
                                            </ButtonAria>
                                            <ButtonAria
                                                onPress={() => zoomOut()}
                                                className="flex w-full items-center justify-center border-r border-accent bg-foreground px-2 py-1 text-sm text-secondary pressed:bg-background pressed:text-primary focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:bg-foreground/50 disabled:text-primary/50 disabled:opacity-50">
                                                <LuZoomOut className="size-4" />
                                            </ButtonAria>
                                            <ButtonAria
                                                onPress={() => resetTransform()}
                                                className="flex w-full items-center justify-center bg-foreground px-2 py-1 text-sm text-secondary pressed:bg-background pressed:text-primary focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:bg-foreground/50 disabled:text-primary/50 disabled:opacity-50">
                                                <LuRefreshCcw className="size-4" />
                                            </ButtonAria>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className='flex-1'>
                                                <h4 className="font-medium text-primary">{name}</h4>
                                                <p className="text-xs text-action">{width} x {height} | {mediaType} | {size}</p>
                                            </div>
                                            {transformedImageUrl &&
                                                <ButtonAria
                                                    onPress={downloadPNG}
                                                    className="mx-auto inline-flex items-center justify-center rounded-md border border-action/20 bg-actionForeground px-2 py-1 text-sm text-action focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:bg-actionForeground/50 disabled:text-action/50 disabled:opacity-50">
                                                    <LuDownload className="mr-2 size-4" />
                                                    Download
                                                </ButtonAria>
                                            }
                                        </div>
                                    </div>
                                )}
                            </TransformWrapper>
                            <ButtonAria
                                onPress={close}
                                className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-background/50 text-primary hover:bg-background/70">
                                &#x2715;
                            </ButtonAria>
                        </>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    )
}