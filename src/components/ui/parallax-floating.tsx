"use client"

import React, { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface FloatingProps {
  children: React.ReactNode
  className?: string
  sensitivity?: number
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  depth?: number
  x?: number
  y?: number
}

function Floating({
  children,
  className,
  sensitivity = 1,
}: FloatingProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = ref.current!.getBoundingClientRect()
      
      // Calculate mouse position relative to the center of the container
      const x = (clientX - left - width / 2) / (width / 2)
      const y = (clientY - top - height / 2) / (height / 2)
      
      setPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{
        perspective: "1000px",
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === FloatingElement) {
          return React.cloneElement(child as React.ReactElement<FloatingElementProps>, {
            ...child.props,
            x: position.x * sensitivity,
            y: position.y * sensitivity,
          })
        }
        return child
      })}
    </div>
  )
}

// The FloatingElement is the component that actually moves
const FloatingElement = ({
  children,
  className,
  depth = 1,
  x = 0,
  y = 0,
}: FloatingElementProps) => {
  return (
    <div
      className={cn("absolute", className)}
      style={{
        transform: `translate3d(${x * depth * 20}px, ${y * depth * 20}px, 0)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {children}
    </div>
  )
}

export { Floating, FloatingElement }
export default Floating 
