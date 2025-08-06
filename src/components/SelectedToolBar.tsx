import { useRowIds, useStore } from '@/lib/schema';
import { saveAs } from "file-saver";
import JSZip from "jszip";
import React from 'react';
import { Key } from 'react-aria-components';
import { LuDownload, LuTrash, LuX } from 'react-icons/lu';
import { toast } from 'sonner';
import { Button } from './ui/Button';

type Props = {
    selectedKeys: "all" | Iterable<Key> | undefined
    setSelectedKeys: React.Dispatch<React.SetStateAction<"all" | Iterable<Key> | undefined>>;
}

export default function SelectedToolBar({ selectedKeys, setSelectedKeys }: Props) {
    const storeReference = useStore();
    const imagesRowIds = useRowIds("images");
    const hasSelectedKeys = selectedKeys === 'all' || (selectedKeys && (Array.isArray(selectedKeys) ? selectedKeys.length > 0 : [...selectedKeys].length > 0))
    const selectedKeysLength = selectedKeys === 'all' ? 'all' : (selectedKeys ? (Array.isArray(selectedKeys) ? selectedKeys.length : [...selectedKeys].length) : 0);

    const handleUnselectAll = () => {
        setSelectedKeys(new Set());
    };

    const removeSelected = () => {
        if (selectedKeys === "all") {
            storeReference?.delTable("images")
        }
        else if (selectedKeys) {
            storeReference?.transaction(() => {
                for (const key of selectedKeys as Iterable<Key>) {
                    storeReference.delRow("images", `${key}`)
                }
            })
        }
        toast.message(`${selectedKeysLength} images has been deleted`)
        handleUnselectAll()
    }

    const downloadAsZip = async () => {
        const zip = new JSZip();
        const processRow = (rowId: string | number) =>
            new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const name = storeReference?.getCell('images', `${rowId}`, 'name') as string;
                const transformedImageUrl = storeReference?.getCell('images', `${rowId}`, 'transformedImageUrl') as string;
                const imageUrl = storeReference?.getCell('images', `${rowId}`, 'imageUrl') as string;
                const img = new Image();
                img.src = transformedImageUrl || imageUrl;
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(
                            (blob) => {
                                if (blob) {
                                    zip.file(name, blob);
                                }
                                resolve(null);
                            },
                            'image/png'
                        );
                    }
                };
            });
        const rowIds = selectedKeys === 'all' ? imagesRowIds : Array.from(selectedKeys as Iterable<Key>);
        const promises = rowIds.map(processRow);
        await Promise.all(promises);
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "images.zip");
    }

    return (
        <div className="flex items-center gap-2">
            {hasSelectedKeys && (
                <>
                    <Button type='button' className='text-primary' onClick={handleUnselectAll}>
                        <LuX className='size-5' />
                    </Button>
                    <p className='font-bold text-primary'>{selectedKeys === 'all' ? 'All selected' : `${selectedKeysLength} selected`}</p>
                    <Button
                        type='button'
                        onClick={downloadAsZip}
                        className='ml-auto'
                        variant="success"
                    >
                        <LuDownload className='mr-2 size-4' />
                        {selectedKeys === 'all' ? 'All selected' : `${selectedKeysLength} selected`}
                    </Button>
                    <Button type='button' variant={'danger'} onClick={removeSelected}>
                        <LuTrash className='mr-2 size-5' />
                        Delete {selectedKeys === 'all' ? 'All selected' : `${selectedKeysLength} selected`}
                    </Button>
                </>
            )}
        </div>
    )
}