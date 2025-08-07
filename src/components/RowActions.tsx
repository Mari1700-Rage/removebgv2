import { useCell, useDelRowCallback } from '@/lib/schema';
import { default as NextImage } from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button as ButtonAria, Dialog, Menu, MenuItem, MenuItemProps, MenuTrigger, Modal, ModalOverlay, Popover } from 'react-aria-components';
import { LuArrowRight, LuFileImage, LuMoreHorizontal, LuRefreshCcw, LuTrash, LuZoomIn, LuZoomOut } from 'react-icons/lu';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function ActionItem(props: MenuItemProps) {
    return (
        <MenuItem
            {...props}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "hover:bg-accent hover:text-accent-foreground",
                "disabled:pointer-events-none disabled:opacity-50"
            )}
        />
    );
}

type Props = {
    rowId: string
}

export default function RowActions({ rowId }: Props) {
    const [open, setOpen] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const name = useCell("images", rowId, "name") as string
    const imageUrl = useCell("images", rowId, "imageUrl") as string
    const transformedImageUrl = useCell("images", rowId, "transformedImageUrl") as string
    const height = useCell("images", rowId, "height")
    const width = useCell("images", rowId, "width")
    const router = useRouter()

    const removeImage = useDelRowCallback(
        "images",
        rowId,
        undefined,
        () => {
            toast.message(`Deleted image:${name}`);
        }
    );

    return (
        <>
            <MenuTrigger>
                <ButtonAria
                    aria-label="Menu"
                    className="inline-flex items-center justify-center rounded-md border border-accent bg-foreground px-2 py-1 text-sm text-primary focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:text-primary/50 disabled:opacity-50"
                >
                    <LuMoreHorizontal className='size-4' />
                </ButtonAria>
                <Popover placement='bottom right' className="origin-top-left overflow-auto rounded-lg border border-accent bg-foreground/50 p-1 shadow-lg ring-1 ring-accent/5 backdrop-blur-md fill-mode-forwards entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:zoom-out-95">
                    <Menu className="outline-none">
                        <ActionItem id="open" onAction={() => router.push(`/background-remover/${rowId}?${searchParams?.toString() ?? ''}`, { scroll: false })}>
                            <div className="flex items-center gap-2">
                                <LuArrowRight className="size-4" />
                                <span>Open</span>
                            </div>
                        </ActionItem>
                        {transformedImageUrl &&
                            <ActionItem id="compare" onAction={() => setOpen(true)}>
                                <LuFileImage className="mr-2 size-4" />
                                compare
                            </ActionItem>
                        }
                        <ActionItem id="delete" onAction={removeImage}>
                            <div className="flex items-center gap-2">
                                <LuTrash className="size-4" />
                                <span>Delete</span>
                            </div>
                        </ActionItem>
                    </Menu>
                </Popover>
            </MenuTrigger>
            <ModalOverlay
                isOpen={open}
                onOpenChange={setOpen}
                isDismissable
                className={({ isEntering, isExiting }) => `
                fixed inset-0 z-50 overflow-y-auto bg-background/25 flex min-h-full items-center justify-center p-4 te
