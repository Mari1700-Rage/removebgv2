"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useMemo, useState } from "react"

const backgroundImages = Array.from({ length: 18 }, (_, i) => ({
  id: `${i + 1}`,
  src: `/background/${i + 1}-min.jpg`,
  alt: `Background ${i + 1}`,
}))

const ITEMS_PER_PAGE = 6

const BackgroundSelector = ({
  selectedBackground,
  onSelectBackground,
  rightElement,
}: {
  selectedBackground: string | null
  onSelectBackground: (background: string | null) => void
  rightElement?: React.ReactNode
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const totalPages = useMemo(() => Math.ceil(backgroundImages.length / ITEMS_PER_PAGE), [])

  useEffect(() => {
    const preloadImages = backgroundImages.slice(0, ITEMS_PER_PAGE * 2)
    let isMounted = true

    Promise.all(
      preloadImages.map((img) => {
        return new Promise<void>((resolve) => {
          const image = new window.Image()
          image.src = img.src
          image.onload = () => resolve()
          image.onerror = () => resolve()
        })
      })
    ).then(() => {
      if (isMounted) setIsLoaded(true)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const displayedImages = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE
    return backgroundImages.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage])

  const handleBackgroundSelect = useCallback(
    (bg: string | null) => {
      onSelectBackground(bg)
    },
    [onSelectBackground]
  )

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }, [totalPages])

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }, [totalPages])

  return (
    <div className="w-full">
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-[90vw] max-w-3xl h-[70vh] bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 z-10 text-white bg-black/60 rounded-full p-1 hover:bg-black"
            >
              ✕
            </button>
            <button
              onClick={() => setIsZoomed((z) => !z)}
              className="absolute bottom-2 left-2 z-10 bg-black/60 text-white px-2 py-1 text-xs rounded"
            >
              {isZoomed ? "Reset Zoom" : "Zoom"}
            </button>
            <div className="relative w-full h-full">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className={cn(
                  "object-contain transition-transform duration-300",
                  isZoomed && "scale-150"
                )}
                sizes="90vw"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Background Images</h3>
        {rightElement ?? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {currentPage + 1}/{totalPages}
            </span>
            <div className="flex gap-1">
              <button onClick={prevPage} className="btn-nav" aria-label="Prev">
                ◀
              </button>
              <button onClick={nextPage} className="btn-nav" aria-label="Next">
                ▶
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "grid grid-cols-3 sm:grid-cols-5 gap-2 transition-opacity duration-500",
          !isLoaded && "opacity-50"
        )}
      >
        <button
          onClick={() => handleBackgroundSelect(null)}
          className={cn(
            "aspect-square rounded-lg border p-1 flex items-center justify-center bg-checkered",
            selectedBackground === null
              ? "ring-2 ring-indigo-500"
              : "ring-1 ring-gray-300 hover:ring-indigo-300"
          )}
        >
          <span className="text-xs text-gray-500">None</span>
        </button>

        {displayedImages.map((bg) => (
          <div
            key={bg.id}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden group",
              selectedBackground === bg.src
                ? "ring-2 ring-indigo-500"
                : "ring-1 ring-gray-200 hover:ring-indigo-300"
            )}
          >
            <button
              onClick={() => handleBackgroundSelect(bg.src)}
              className="absolute inset-0 z-10"
              aria-label={bg.alt}
            />
            <Image
              src={bg.src}
              alt={bg.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={parseInt(bg.id) <= 6}
            />
            <button
              onClick={() => setPreviewImage(bg.src)}
              className="absolute bottom-1 right-1 z-20 bg-white/80 text-xs px-2 py-0.5 rounded shadow"
            >
              Preview
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={`dot-${i}`}
            onClick={() => setCurrentPage(i)}
            className={cn(
              "h-1.5 w-6 rounded-full transition-all",
              currentPage === i ? "bg-indigo-500" : "bg-gray-300 hover:bg-gray-400"
            )}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default BackgroundSelector
