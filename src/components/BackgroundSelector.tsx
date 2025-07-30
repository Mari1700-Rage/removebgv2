"use client"

import { cn } from "@/lib/utils"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

type BackgroundImage = {
  id: string
  src: string
  alt: string
}

const backgroundImages: BackgroundImage[] = [
  { id: "1", src: "/background/1-min.jpg", alt: "Background 1" },
  { id: "2", src: "/background/2-min.jpg", alt: "Background 2" },
  { id: "3", src: "/background/3-min.jpg", alt: "Background 3" },
  { id: "4", src: "/background/4-min.jpg", alt: "Background 4" },
  { id: "5", src: "/background/5-min.jpg", alt: "Background 5" },
  { id: "6", src: "/background/6-min.jpg", alt: "Background 6" },
  { id: "7", src: "/background/7-min.jpg", alt: "Background 7" },
  { id: "8", src: "/background/8-min.jpg", alt: "Background 8" },
  { id: "9", src: "/background/9-min.jpg", alt: "Background 9" },
  { id: "10", src: "/background/10-min.jpg", alt: "Background 10" },
  { id: "11", src: "/background/11-min.jpg", alt: "Background 11" },
  { id: "12", src: "/background/12-min.jpg", alt: "Background 12" },
  { id: "13", src: "/background/13-min.jpg", alt: "Background 13" },
  { id: "14", src: "/background/14-min.jpg", alt: "Background 14" },
  { id: "15", src: "/background/15-min.jpg", alt: "Background 15" },
  { id: "16", src: "/background/16-min.jpg", alt: "Background 16" },
  { id: "17", src: "/background/17-min.jpg", alt: "Background 17" },
    { id: "18", src: "/background/18-min.jpg", alt: "Background 18" },
]

const ITEMS_PER_PAGE = 5

interface BackgroundSelectorProps {
  selectedBackground: string | null
  onSelectBackground: (background: string | null) => void
  rightElement?: React.ReactNode
}

// Used only once, so safe to define outside render
const TRANSPARENT_BG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC"

export default function BackgroundSelector({
  selectedBackground,
  onSelectBackground,
  rightElement,
}: BackgroundSelectorProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(backgroundImages.length / ITEMS_PER_PAGE)

  // Preload only first page + one ahead
  useEffect(() => {
    const preloadImages = backgroundImages.slice(0, ITEMS_PER_PAGE * 2)
    Promise.all(
      preloadImages.map((img) => {
        return new Promise((resolve) => {
          const image = new Image()
          image.src = img.src
          image.onload = resolve
          image.onerror = resolve
        })
      })
    ).then(() => {
      setIsLoaded(true)
    })
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
          >
            <div className="h-full w-full rounded-md bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] bg-repeat flex items-center justify-center">
              <span className="text-xs font-medium text-gray-500 bg-white/70 px-1.5 py-0.5 rounded">
                None
              </span>
            </div>
          </button>

          {/* Background images */}
          {displayedImages.map((background) => (
            <button
              key={background.id}
              onClick={() => handleBackgroundSelect(background.src)}
              className={cn(
                "aspect-square rounded-lg p-0.5 transition-all overflow-hidden relative",
                selectedBackground === background.src
                  ? "ring-2 ring-[#6C5CE7] ring-offset-2"
                  : "ring-1 ring-gray-200 hover:ring-[#6C5CE7]/50"
              )}
              aria-label={background.alt}
            >
              <img
                src={background.src}
                alt={background.alt}
                className="h-full w-full object-cover rounded-md"
                loading={parseInt(background.id) > 6 ? "lazy" : "eager"}
              />
              {selectedBackground === background.src && (
                <div className="absolute -right-1 -top-1 size-3 rounded-full bg-[#6C5CE7] ring-2 ring-white shadow-md">
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
            </button>
          ))}
        </div>

        {/* Carousel indicators */}
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={`carousel-dot-${index}`}
              onClick={() => setCurrentPage(index)}
              className={cn(
                "h-1.5 w-6 rounded-full transition-all",
                currentPage === index
                  ? "bg-[#6C5CE7]"
                  : "bg-gray-200 hover:bg-gray-300"
              )}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
