"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

const backgroundImages = Array.from({ length: 17 }, (_, i) => {
  const id = `${i + 1}`
  return {
    id,
    src: `/background/${id}-min.jpg`,
    alt: `Background ${id}`,
  }
})

const ITEMS_PER_PAGE = 5

const TRANSPARENT_BG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC"

interface BackgroundSelectorProps {
  selectedBackground: string | null
  onSelectBackground: (background: string | null) => void
  rightElement?: React.ReactNode
}

export default function BackgroundSelector({
  selectedBackground,
  onSelectBackground,
  rightElement,
}: BackgroundSelectorProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const totalPages = useMemo(() => Math.ceil(backgroundImages.length / ITEMS_PER_PAGE), [])

  useEffect(() => {
    const preloadImages = backgroundImages.slice(0, ITEMS_PER_PAGE * 2)
    Promise.all(
      preloadImages.map((img) => {
        return new Promise((resolve) => {
          const image = new window.Image()
          image.src = img.src
          image.onload = resolve
          image.onerror = resolve
        })
      })
    ).then(() => setIsLoaded(true))
  }, [])

  const handleBackgroundSelect = useCallback(
    (bg: string | null) => {
      onSelectBackground(bg)
    },
    [onSelectBackground]
  )

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }, [totalPages])

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }, [totalPages])

  const displayedImages = useMemo(() => {
    return backgroundImages.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    )
  }, [currentPage])

  return (
    <div className="w-full">
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all">
          <div className="relative w-[90vw] max-w-3xl h-[70vh] bg-white rounded-xl overflow-hidden animate-fade-in">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 z-10 text-white bg-black/60 rounded-full p-1 hover:bg-black"
              aria-label="Close preview"
            >
              ✕
            </button>
            <button
              onClick={() => setIsZoomed((z) => !z)}
              className="absolute bottom-2 left-2 z-10 bg-black/60 text-white px-2 py-1 text-xs rounded hover:bg-black"
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
        <h3 className="text-sm font-medium text-gray-700">
          Background Images
        </h3>
        <div className="flex items-center gap-2">
          {rightElement ? (
            rightElement
          ) : (
            <>
              <span className="text-xs text-gray-500">
                {currentPage + 1}/{totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={goToPrevPage}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  aria-label="Previous page"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goToNextPage}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  aria-label="Next page"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            "grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 transition-all duration-300",
            !isLoaded && "opacity-50"
          )}
        >
          {/* Transparent Option */}
          <button
            onClick={() => handleBackgroundSelect(null)}
            className={cn(
              "aspect-square rounded-lg p-0.5 transition-all overflow-hidden",
              selectedBackground === null
                ? "ring-2 ring-[#6C5CE7] ring-offset-2"
                : "ring-1 ring-gray-200 hover:ring-[#6C5CE7]/50"
            )}
            aria-label="No background/transparent"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBackgroundSelect(null)
            }}
          >
            <div className="h-full w-full rounded-md bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] bg-repeat flex items-center justify-center">
              <span className="text-xs font-medium text-gray-500 bg-white/70 px-1.5 py-0.5 rounded">
                None
              </span>
            </div>
          </button>

          {/* Background Images */}
          {displayedImages.map((bg) => (
            <div
              key={bg.id}
              className={cn(
                "relative aspect-square rounded-lg p-0.5 overflow-hidden group",
                selectedBackground === bg.src
                  ? "ring-2 ring-[#6C5CE7] ring-offset-2"
                  : "ring-1 ring-gray-200 hover:ring-[#6C5CE7]/50"
              )}
            >
              <button
                onClick={() => handleBackgroundSelect(bg.src)}
                aria-label={bg.alt}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleBackgroundSelect(bg.src)
                }}
                className="absolute inset-0 z-10"
              />
              <div className="relative w-full h-full">
                <Image
                  src={bg.src}
                  alt={bg.alt}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={parseInt(bg.id) <= 6}
                />
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(bg.src)}
                className="absolute bottom-1 right-1 z-20 rounded bg-white/80 px-1.5 py-0.5 text-xs text-gray-700 shadow hover:bg-white"
              >
                Preview
              </button>
              {selectedBackground === bg.src && (
                <div className="absolute -right-1 -top-1 size-3 rounded-full bg-[#6C5CE7] ring-2 ring-white shadow-md z-20">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-full p-0.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Carousel indicators */}
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setCurrentPage(i)}
              className={cn(
                "h-1.5 w-6 rounded-full transition-all",
                currentPage === i ? "bg-[#6C5CE7]" : "bg-gray-200 hover:bg-gray-300"
              )}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
