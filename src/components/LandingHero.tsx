"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { LuUpload, LuSparkles, LuImage, LuArrowRight } from "react-icons/lu"
import { useStore } from "@/lib/schema"
import { cn } from "@/lib/utils"

export function LandingHero() {
  const router = useRouter()
  const storeReference = useStore()
  const [hoverUpload, setHoverUpload] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    storeReference?.transaction(() => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const base64String = reader.result as string
          const imgElement = new window.Image()
          imgElement.src = base64String
          imgElement.onload = () => {
            storeReference.addRow('images', {
              name: file.name,
              size: file.size,
              imageUrl: base64String,
              mediaType: file.type,
              height: imgElement.height,
              width: imgElement.width,
            })
            // Redirect to background-remover page after successful upload
            router.push('/background-remover')
          }
        }
      })
    })
  }, [storeReference, router])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  })

  return (
    <section className="w-full py-12 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hero Container with Gradient Background */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 via-[#8C85FF]/5 to-[#EC4899]/5 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366F1] to-[#EC4899] z-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EC4899]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5 z-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366F1" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10 p-8 md:p-10">
            {/* Centered Content */}
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-[#6366F1] px-3 py-1.5 rounded-full text-xs font-medium shadow-sm mx-auto"
              >
                <LuSparkles className="w-3.5 h-3.5" />
                <span>AI-POWERED · FAST · FREE</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold leading-tight"
              >
                <span className="block">Background Remover</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#EC4899]">in one click</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
              >
                Transform your images instantly. Remove backgrounds with a single click and unleash your creative vision.
                <span className="block mt-2 text-sm font-medium">No signup required. No watermarks. Professional quality.</span>
              </motion.p>
              
              {/* Features List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-2"
              >
                {[
                  { label: "100% Free", icon: "✓" },
                  { label: "No Signup", icon: "✓" },
                  { label: "No Watermarks", icon: "✓" },
                  { label: "Instant Results", icon: "✓" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center justify-start gap-2 py-1">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold">
                      {feature.icon}
                    </span>
                    <span className="text-sm text-gray-700 font-medium">{feature.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Main Upload Box */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white shadow-xl rounded-xl overflow-hidden mt-6 border border-gray-100"
              >
                <div className="p-1">
                  <div
                    {...getRootProps()}
                    onMouseEnter={() => setHoverUpload(true)}
                    onMouseLeave={() => setHoverUpload(false)}
                    className={cn(
                      "relative w-full overflow-hidden rounded-lg border-2 border-dashed p-8 transition-all duration-300 cursor-pointer group",
                      isDragAccept ? "border-[#6366F1] bg-[#6366F1]/5" : 
                      isDragReject ? "border-red-500 bg-red-50" : 
                      isDragActive ? "border-[#6366F1] bg-[#6366F1]/5" : 
                      "border-gray-200 hover:border-[#6366F1] hover:bg-[#6366F1]/5"
                    )}
                  >
                    <input {...getInputProps()} />
                    
                    <div className="flex flex-col items-center text-center">
                      <div className={cn(
                        "rounded-full transition-all duration-300 flex items-center justify-center h-16 w-16 mb-4",
                        hoverUpload || isDragActive ? "bg-[#6366F1] text-white" : "bg-gradient-to-r from-[#6366F1]/10 to-[#EC4899]/10 text-[#6366F1]"
                      )}>
                        <LuUpload className="h-8 w-8" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">
                        {isDragActive 
                          ? isDragAccept 
                            ? "Drop to upload" 
                            : "This file type is not supported"
                          : "Drag & drop your image here"}
                      </h3>
                      <p className="text-gray-500 mb-4">or click to browse</p>
                      
                      <div className="flex flex-wrap justify-center items-center gap-3">
                        {["JPG", "PNG", "JPEG"].map((format) => (
                          <span 
                            key={format}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
                          >
                            {format}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500">Max 15MB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alternative Upload Button */}
                <div className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] p-px">
                  <button
                    onClick={() => {
                      const fileInput = document.querySelector('input[type="file"]');
                      if (fileInput instanceof HTMLElement) {
                        fileInput.click();
                      }
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-white py-4 text-center transition-all duration-300 hover:bg-gradient-to-r hover:from-[#6366F1] hover:to-[#EC4899] group"
                  >
                    <span className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#EC4899] group-hover:text-white transition-colors duration-300">
                      Start Removing Backgrounds
                    </span>
                    <LuArrowRight className="text-[#6366F1] group-hover:text-white transition-colors duration-300" />
                  </button>
                </div>
              </motion.div>
              
              {/* Processing Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex flex-wrap justify-center gap-x-12 gap-y-4 pt-6 pb-2"
              >
                {[
                  { number: "10M+", label: "Images Processed" },
                  { number: "3s", label: "Avg. Processing Time" },
                  { number: "99%", label: "Accuracy" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#EC4899]">
                      {stat.number}
                    </p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 