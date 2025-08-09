"use client"

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import HowTo from "@/components/HowTo";


// Fallback DropZone loading state
function LoadingDropZone() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = mounted ? resolvedTheme || theme : "light";

  return (
    <div
      className={`w-full h-[300px] border-2 border-dashed ${
        currentTheme === "light"
          ? "border-gray-300 bg-gray-100/50"
          : "border-gray-600 bg-gray-800/30"
      } rounded-xl flex items-center justify-center`}
    >
      <div
        className={`animate-pulse ${
          currentTheme === "light" ? "text-gray-500" : "text-gray-300"
        }`}
      >
        Loading background remover...
      </div>
    </div>
  );
}

// Dynamically load DropZone component without SSR
const DropZone = dynamic(() => import("@/components/DropZone"), {
  ssr: false,
  loading: () => <LoadingDropZone />,
});

export default function BackgroundRemoverPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Feature detection for WebGL/WebGPU
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    const hasWebGPU = "gpu" in navigator;

    if (!gl) {
      console.warn("WebGL not supported — this browser may not work.");
      setIsBrowserSupported(false);
    }

    if (!hasWebGPU) {
      console.info("WebGPU not available — falling back to CPU if possible.");
    }

    // Load Google AdSense
    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4619589162374260";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const currentTheme = mounted ? resolvedTheme || theme : "light";

  return (
    <div
      className={`min-h-screen ${
        currentTheme === "light" ? "bg-gray-50 text-gray-900" : "bg-gray-900 text-white"
      } py-16`}
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Badge */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-center mb-6">
            <div
              className={`inline-flex items-center gap-2 ${
                currentTheme === "light"
                  ? "bg-white border border-gray-200 shadow-sm"
                  : "bg-gray-800 border border-gray-700 shadow-sm"
              } rounded-2xl px-4 py-2 text-sm`}
            >
              <span className="text-orange-400 text-lg">🏆</span>
              <span
                className={`font-medium ${
                  currentTheme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                #1 Product of the Day
              </span>
              <span
                className={`text-xs ${
                  currentTheme === "light" ? "text-gray-600" : "text-gray-400"
                } ml-1`}
              >
                Editors' Choice
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1
              className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${
                currentTheme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Remove Background From Images Instantly
            </h1>
            <p
              className={`text-lg ${
                currentTheme === "light" ? "text-gray-600" : "text-gray-300"
              } mb-8 max-w-2xl mx-auto`}
            >
              Transform your images with AI-powered background removal. Achieve professional results in seconds.
            </p>
          </div>
        </div>

        {/* DropZone */}
        <div className="mb-12">
          {isBrowserSupported ? (
            <DropZone />
          ) : (
            <div
              className={`w-full h-[300px] border-2 border-dashed ${
                currentTheme === "light"
                  ? "border-red-300 bg-red-100/50 text-red-800"
                  : "border-red-600 bg-red-800/30 text-red-200"
              } rounded-2xl flex items-center justify-center text-center p-4`}
            >
              <div>
                <p className="font-semibold mb-2">⚠️ Your browser is not supported</p>
                <p className="text-sm">
                  Background removal requires WebGL, which is not available in your browser.
                  Please switch to <strong>Chrome</strong> or <strong>Edge</strong> for the best experience.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* HowTo */}
        <div
          className={`${
            currentTheme === "light"
              ? "bg-white border border-gray-200 shadow-sm"
              : "bg-gray-800 border border-gray-700 shadow-sm"
          } rounded-2xl p-8`}
        >
          <HowTo variant={currentTheme === "light" ? "light" : "dark"} />
        </div>
      </div>
    </div>
  );
}
