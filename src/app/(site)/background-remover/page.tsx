"use client"

import dynamic from 'next/dynamic';
import HowTo from "@/components/HowTo";
import { Suspense, useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Create a separate component for the loading state
function LoadingDropZone() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const currentTheme = mounted ? resolvedTheme || theme : 'light';
  
  return (
    <div className={`w-full h-[300px] border-2 border-dashed ${
      currentTheme === 'light' 
        ? 'border-gray-300 bg-gray-100/50' 
        : 'border-gray-600 bg-gray-800/30'
    } rounded-xl flex items-center justify-center`}>
      <div className={`animate-pulse ${currentTheme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>Loading...</div>
    </div>
  );
}

// Dynamically import DropZone with no SSR
const DropZone = dynamic(() => import("@/components/DropZone"), {
  ssr: false,
  loading: () => <LoadingDropZone />
});

export default function BackgroundRemoverPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const currentTheme = mounted ? resolvedTheme || theme : 'light';

  return (
    <div className={`min-h-screen ${
      currentTheme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'
    } py-16`}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="max-w-3xl mx-auto mb-8">
          {/* Product Hunt Badge - Centered above heading */}
          <div className="flex justify-center mb-6">
            <div className={`inline-flex items-center gap-2 ${
              currentTheme === 'light'
                ? 'bg-white border border-gray-200 shadow-sm'
                : 'bg-gray-800 border border-gray-700 shadow-sm'
            } rounded-2xl px-4 py-2 text-sm`}>
              <span className="text-orange-400 text-lg">🏆</span>
              <span className={`font-medium ${currentTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>#1 Product of the Day</span>
              <span className={`text-xs ${currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'} ml-1`}>Editors' Choice</span>
            </div>
          </div>
          
          {/* Header Content */}
          <div className="text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${
              currentTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Remove Background From Images Instantly
            </h1>
            <p className={`text-lg ${currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-8 max-w-2xl mx-auto`}>
              Transform your images with AI-powered background removal. Achieve professional results in seconds.
            </p>
          </div>
        </div>

        {/* DropZone Section */}
        <div className="mb-12">
          <Suspense fallback={
            <div className={`w-full h-[300px] border-2 border-dashed ${
              currentTheme === 'light' 
                ? 'border-gray-300 bg-gray-100/50' 
                : 'border-gray-600 bg-gray-800/30'
            } rounded-2xl flex items-center justify-center`}>
              <div className={`animate-pulse ${currentTheme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>Loading dropzone...</div>
            </div>
          }>
            <DropZone />
          </Suspense>
        </div>

        {/* HowTo Section */}
        <div className={`${
          currentTheme === 'light'
            ? 'bg-white border border-gray-200 shadow-sm'
            : 'bg-gray-800 border border-gray-700 shadow-sm'
        } rounded-2xl p-8`}>
          <HowTo variant={currentTheme === 'light' ? 'light' : 'dark'} />
        </div>
      </div>
    </div>
  )
}