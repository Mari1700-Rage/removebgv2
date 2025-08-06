"use client"

import dynamic from 'next/dynamic';
import HowTo from "@/components/HowTo";
import { Suspense } from "react";

// Dynamically import DropZone with no SSR
const DropZone = dynamic(() => import("@/components/DropZone"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  )
});

export default function ImagesPage() {
  return (
    <section className='mx-auto flex max-w-[100dvw] flex-1 flex-col gap-10 px-4 py-10 md:w-[840px]'>
      <div className="mx-auto text-center space-y-6">
        <div className="relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#6C5CE7] to-transparent" />
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#574db2]">
              Background Remover
            </h1>
          </div>
          <p className="text-secondary text-xl max-w-[600px] mx-auto leading-relaxed font-medium">
            Transform your images instantly. <span className="text-[#6C5CE7]">Remove backgrounds</span> with a single click and unleash your creative vision.
          </p>
        </div>
      </div>
      <Suspense fallback={
        <div className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <div className="animate-pulse">Loading dropzone...</div>
        </div>
      }>
        <DropZone />
      </Suspense>
      <HowTo />
    </section>
  )
}