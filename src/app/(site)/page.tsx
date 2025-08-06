"use client"

import { useStore } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { LuStar, LuPlus, LuMinus } from "react-icons/lu";
import { useTheme } from "next-themes";
import HowTo from "@/components/HowTo";

export default function HomePage() {
    const router = useRouter();
    const storeReference = useStore();
    const [openFaq, setOpenFaq] = useState<number | null>(0); // Start with first FAQ open
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const dropzoneRef = useRef<HTMLDivElement>(null);
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    // After mounting, we can safely access the theme
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Use resolvedTheme if available, fallback to theme, and default to 'light' when not mounted yet
    const currentTheme = mounted ? resolvedTheme || theme : 'light';
    const isLight = currentTheme === 'light';

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        storeReference?.transaction(() => {
            acceptedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file)
                reader.onload = () => {
                    const base64String = reader.result as string;
                    const imgElement = new window.Image();
                    imgElement.src = base64String;
                    imgElement.onload = () => {
                        storeReference.addRow('images', {
                            name: file.name,
                            size: file.size,
                            imageUrl: base64String,
                            mediaType: file.type,
                            height: imgElement.height,
                            width: imgElement.width,
                        });
                        // Redirect to background-remover page after successful upload
                        router.push('/background-remover');
                    }
                }
            })
        })
    }, [storeReference, router]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        // isDragAccept and isDragReject might be useful for styling later
    } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic"], // Added webp and heic
        },
        noClick: false, // Enable click functionality for the entire dropzone
    });

    // Placeholder images - replace with actual paths or URLs
    const mainImageUrl = "/hero_remove.webp"; // Example image URL
    const thumbnailImages = [
        "hero-images/1.webp",
        "hero-images/2.webp",
        "hero-images/3.webp",
    ];

    // Define the steps for using the background remover
    const steps = [
        {
            title: "Upload Your Image",
            description: "Click the 'Upload Image' button or drag and drop your image into the designated area on the homepage.",
           // icon: "/how-to/upload-icon.svg",
          //  imageUrl: "/how-to/step1.webp",
        },
        {
            title: "Wait For Processing",
            description: "Our AI will instantly process your image and remove the background with high precision.",
          //  icon: "/how-to/process-icon.svg",
          //  imageUrl: "/how-to/step2.webp",
        },
        {
            title: "Download Result",
            description: "Once processing is complete, download your image with the background removed or choose a Custom Background.",
           // icon: "/how-to/download-icon.svg",
            //imageUrl: "/how-to/step3.webp",
        },
    ];

    // Testimonial data
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Photographer",
            content: "This background remover is a game-changer for my product photography. The AI is incredibly accurate and saves me hours of Photoshop work. I can now process all my product photos in minutes!",
            avatarUrl: "/testimonials/avatar1.webp", // Placeholder
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "E-commerce Seller",
            content: "I was skeptical at first, but this tool delivers amazing results. My product images look so much more professional now, and my conversion rates have improved significantly.",
            avatarUrl: "/testimonials/avatar2.webp", // Placeholder
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Social Media Manager",
            content: "We use this tool daily for our client's social media content. The speed and quality are unmatched. Even with complex subjects like hair and fur, the results are impressive.",
            avatarUrl: "/testimonials/avatar3.webp", // Placeholder
            rating: 5
        },
    ];

    // FAQ data
    const faqs = [
        {
            question: "How does the background remover work?",
            answer: "Our background remover uses advanced AI technology to automatically detect and remove backgrounds from images. Simply upload your image, and our tool will instantly process it to create a transparent background. You can then download your image in high quality."
        },
        {
            question: "Is the background remover tool free to use?",
            answer: "Yes, our background remover tool is completely free to use with no hidden fees. You can remove backgrounds from as many images as you want without any cost."
        },
        {
            question: "What file formats are supported?",
            answer: "Our tool supports all common image formats including JPEG, PNG, WebP, and HEIC. After processing, you can download your images with transparent backgrounds as PNG files."
        },
        {
            question: "How accurate is the background removal?",
            answer: "Our AI-powered tool delivers highly accurate results in most cases. It works best with clear subjects against distinguishable backgrounds. For complex images, you might need to make minor adjustments."
        },
    ];

    return (
        <>
            <Script 
                id="structured-data" 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Eraseto Background Remover",
                        "applicationCategory": "DesignApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "Free online tool to remove backgrounds from images using AI technology",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "246"
                        },
                        "featureList": "Background removal, Transparency, No watermark, Instant download",
                        "screenshot": "https://eraseto.com/hero_remove.webp"
                    })
                }}
            />
            <Script 
                id="faq-schema" 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map(faq => ({
                            "@type": "Question",
                            "name": faq.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer
                            }
                        }))
                    })
                }}
            />
            <div className={`min-h-screen ${
                currentTheme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'
            } relative overflow-hidden`}>
                
                {/* Background Shapes */}
                {currentTheme !== 'light' ? (
                    <>
                        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-600 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-600 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                    </>
                ) : (
                    <>
                        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-blob"></div>
                        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-sky-500 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
                    </>
                )}

                {/* Hero Section */}
                <div className="relative z-10 pt-20">
                    <div className="container mx-auto max-w-7xl px-4">
                        
                        {/* Main Title */}
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center mb-6">
                                <svg 
                                    className="w-16 h-16 mr-4" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M8 12l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                                    Background Remover
                                </h1>
                            </div>
                            
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
                                Erase image backgrounds for free and replace it with different backgrounds of your choosing.
                            </p>
                        </div>

                        {/* Main Content Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start mb-16">
                            
                            {/* Left Image */}
                            <div className="hidden lg:flex justify-center">
                                <div className="relative w-28 h-40 rounded-xl overflow-hidden shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
                                    <Image 
                                        src="/small.webp" 
                                        alt="Product example with background removed" 
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div className="flex flex-col items-center">
                                <div 
                                    {...getRootProps()}
                                    ref={dropzoneRef}
                                    className={cn(
                                        "relative w-full max-w-lg transition-all duration-300 cursor-pointer",
                                        isDragActive 
                                            ? "transform scale-105" 
                                            : ""
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    
                                    {/* Main Upload Container */}
                                    <div className={cn(
                                        "relative h-96 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 overflow-hidden",
                                        "border-2 border-dashed",
                                        isDragActive 
                                            ? currentTheme === 'light'
                                                ? "border-gray-400 bg-gray-50/80 shadow-lg" 
                                                : "border-gray-500 bg-gray-800/80 shadow-lg"
                                            : currentTheme === 'light'
                                                ? "border-gray-300 bg-white shadow-sm"
                                                : "border-gray-600 bg-gray-800 shadow-sm"
                                    )}>
                                        
                                        {/* Animated Background Pattern */}
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="absolute inset-0" 
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='${currentTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
                                                }}
                                            />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                                            
                                            {/* Upload Icon */}
                                            <div className={cn(
                                                "relative p-6 rounded-2xl shadow-lg",
                                                currentTheme === 'light'
                                                    ? "bg-gray-900"
                                                    : "bg-white"
                                            )}>
                                                <svg 
                                                    className={cn(
                                                        "w-4 h-4",
                                                        currentTheme === 'light' ? "text-white" : "text-gray-900"
                                                    )}
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                                    />
                                                </svg>
                                            </div>
                                            
                                            {/* Main Text */}
                                            <div className="text-center space-y-2">
                                                <h3 className={cn(
                                                    "text-2xl font-bold",
                                                    currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                                )}>
                                                    {isDragActive ? 'Drop your image here' : 'Upload Your Image'}
                                                </h3>
                                                <p className={cn(
                                                    "text-sm font-medium",
                                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                )}>
                                                    {isDragActive 
                                                        ? 'Release to start processing' 
                                                        : 'Drag and drop or click to browse'
                                                    }
                                                </p>
                                            </div>
                                            
                                            {/* Upload Button */}
                                            <div className="cursor-pointer">
                                                <span className={cn(
                                                    "inline-flex items-center justify-center px-8 py-4 font-semibold rounded-2xl transition-all duration-300 shadow-lg",
                                                    currentTheme === 'light'
                                                        ? "bg-gray-900 hover:bg-gray-800 text-white"
                                                        : "bg-white hover:bg-gray-100 text-gray-900"
                                                )}>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Choose Image
                                                </span>
                                            </div>
                                            
                                            {/* Supported Formats */}
                                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                                {['JPG', 'PNG', 'WebP'].map((format) => (
                                                    <span 
                                                        key={format}
                                                        className={cn(
                                                            "px-3 py-1 text-xs font-medium rounded-full",
                                                            currentTheme === 'light'
                                                                ? "bg-gray-100 text-gray-600"
                                                                : "bg-gray-700 text-gray-300"
                                                        )}
                                                    >
                                                        {format}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* No image section */}
                                <div className="mt-4 text-center">
                                    <p className={cn(
                                        "text-base font-medium mb-3",
                                        currentTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                    )}>
                                        <span className="font-bold">No image?</span> Try one of these samples
                                    </p>
                                    <div className="flex justify-center space-x-1">
                                        {['/1.webp', '/2.webp', '/3.webp', '/hero_remove.webp'].map((src, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    // Handle sample image selection
                                                    fetch(src)
                                                        .then(res => res.blob())
                                                        .then(blob => {
                                                            const file = new File([blob], `sample-${index + 1}.webp`, { type: 'image/webp' });
                                                            onDrop([file]);
                                                        });
                                                }}
                                                className={cn(
                                                    "relative w-14 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-md hover:scale-105",
                                                    currentTheme === 'light'
                                                        ? "border-gray-200 hover:border-gray-300"
                                                        : "border-gray-600 hover:border-gray-500"
                                                )}
                                            >
                                                <Image 
                                                    src={src} 
                                                    alt={`Sample image ${index + 1}`} 
                                                    width={56} 
                                                    height={48} 
                                                    style={{ objectFit: 'cover' }}
                                                    className="transition-transform duration-300 hover:scale-105"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Privacy Policy Footer */}
                                    <div className="mt-4 text-xs text-gray-500 max-w-md mx-auto">
                                        <p className="leading-relaxed">
                                            By uploading an image you agree to our{' '}
                                            <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200">
                                                Terms of Service
                                            </Link>
                                            . For more details on processing and your rights, check our{' '}
                                            <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200">
                                                Privacy Policy
                                            </Link>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="hidden lg:flex justify-center">
                                <div className="relative w-40 h-56 rounded-xl overflow-hidden transform -rotate-3 hover:rotate-0 transition-all duration-300 -mt-8" style={{ backgroundColor: '#f9fafb' }}>
                                    <Image 
                                        src="/demo-image-1.webp" 
                                        alt="Person example with background removed" 
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        className="transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                {/* How To Section */}
                <div className={`py-16 ${
                    currentTheme === 'light' 
                        ? 'bg-gradient-to-br from-slate-50 to-gray-100' 
                        : 'bg-gradient-to-br from-slate-900 to-gray-900'
                }`} id="how-to">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                                How to Remove Background
                            </h2>
                            <p className={`text-lg ${
                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                            } max-w-2xl mx-auto`}>
                                Follow these simple steps to get professional results in seconds
                            </p>
                        </div>

                        {/* Steps Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {steps.map((step, index) => (
                                <div key={index} className="relative group">
                                    {/* Step Number */}
                                    <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-lg ${
                                        currentTheme === 'light'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-900'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    
                                    {/* Card */}
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                                            : 'bg-gray-800 border border-gray-700 shadow-sm hover:shadow-lg'
                                    } rounded-2xl p-6 pt-8 transition-all duration-300 group-hover:-translate-y-1 h-full`}>
                                        

                                        
                                        {/* Content */}
                                        <h3 className={`text-xl font-bold mb-3 ${
                                            currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                        }`}>
                                            {step.title}
                                        </h3>
                                        
                                        <p className={`${
                                            currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                        } leading-relaxed`}>
                                            {step.description}
                                        </p>
                                        
                                        {/* Arrow for desktop */}
                                        {index < steps.length - 1 && (
                                            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    currentTheme === 'light'
                                                        ? 'bg-gray-200 text-gray-600'
                                                        : 'bg-gray-700 text-gray-300'
                                                }`}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* CTA Button */}
                        <div className="text-center">
                            <button 
                                onClick={() => dropzoneRef.current?.click()}
                                className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                                    currentTheme === 'light'
                                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                        : 'bg-white hover:bg-gray-100 text-gray-900'
                                }`}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </div>

                                {/* Feature Section */}
                <div className="py-12">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left side - Image */}
                            <div className="relative">
                                <div className="relative w-full h-[280px] md:h-[320px] rounded-xl overflow-hidden shadow-lg">
                                    <Image 
                                        src="/feature2.webp" 
                                        alt="Background removal feature demonstration" 
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* Right side - Content */}
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <h2 className={`text-2xl md:text-3xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Instantly Remove Backgrounds
                                    </h2>
                                    <p className={`text-base ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        AI-powered tool that automatically detects and removes backgrounds 
                                        in seconds. Perfect for e-commerce, marketing, and profile pics.
                                    </p>
                                </div>

                                {/* Features list */}
                                <div className="space-y-3">
                                    {[
                                        { icon: "✨", title: "AI-Powered Precision" },
                                        { icon: "⚡", title: "Lightning Fast" },
                                        { icon: "🎯", title: "Professional Results" },
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                                                currentTheme === 'light'
                                                    ? 'bg-gray-100 text-gray-600'
                                                    : 'bg-gray-700 text-gray-300'
                                            }`}>
                                                {feature.icon}
                                            </div>
                                            <h3 className={`font-medium ${
                                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                            }`}>
                                                {feature.title}
                                            </h3>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <div className="pt-2">
                                    <button 
                                        onClick={() => dropzoneRef.current?.click()}
                                        className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                                : 'bg-white hover:bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        Try it now
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Feature Section */}
                <div className={`py-12 ${
                    currentTheme === 'light' 
                        ? 'bg-gradient-to-br from-slate-50 to-gray-100' 
                        : 'bg-gradient-to-br from-slate-900 to-gray-900'
                }`}>
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left side - Content */}
                            <div className="space-y-4 order-2 lg:order-1">
                                <div className="space-y-3">
                                    <h2 className={`text-2xl md:text-3xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        High-Quality Results, Every Time
                                    </h2>
                                    <p className={`text-base ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        Maintain original image quality while delivering clean, precise 
                                        edges — whether it's hair, fur, or fine details.
                                    </p>
                                </div>

                                {/* Features list */}
                                <div className="space-y-3">
                                    {[
                                        { icon: "🔍", title: "Pixel-Perfect Precision" },
                                        { icon: "🎨", title: "Detail Preservation" },
                                        { icon: "💎", title: "Original Quality" }
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                                                currentTheme === 'light'
                                                    ? 'bg-gray-100 text-gray-600'
                                                    : 'bg-gray-700 text-gray-300'
                                            }`}>
                                                {feature.icon}
                                            </div>
                                            <h3 className={`font-medium ${
                                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                            }`}>
                                                {feature.title}
                                            </h3>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <div className="pt-2">
                                    <button 
                                        onClick={() => dropzoneRef.current?.click()}
                                        className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                                : 'bg-white hover:bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        Try it now
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Right side - Image */}
                            <div className="relative order-1 lg:order-2">
                                <div className="relative w-full h-[280px] md:h-[320px] rounded-xl overflow-hidden shadow-lg">
                                    <Image 
                                        src="/feature1.webp" 
                                        alt="High-quality background removal results" 
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="py-16">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                                What our users are saying
                            </h2>
                        </div>

                        {/* Testimonials Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={index} 
                                    className={`${
                                        currentTheme === 'light'
                                            ? 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                                            : 'bg-gray-800 border border-gray-700 shadow-sm hover:shadow-lg'
                                    } rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col`}
                                >
                                    {/* Stars */}
                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <LuStar 
                                                key={i}
                                                className={`w-5 h-5 ${
                                                    i < testimonial.rating 
                                                        ? 'text-yellow-400 fill-yellow-400' 
                                                        : currentTheme === 'light' ? 'text-gray-300' : 'text-gray-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    
                                    {/* Quote */}
                                    <p className={`${
                                        currentTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                    } mb-6 flex-grow leading-relaxed`}>
                                        {testimonial.content}
                                    </p>
                                    
                                    {/* Author */}
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-900'
                                                : 'bg-white text-gray-900'
                                        }`}>
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${
                                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                            }`}>
                                                {testimonial.name}
                                            </h3>
                                            <p className={`text-sm ${
                                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                            }`}>
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center">
                            <Link 
                                href="/reviews"
                                className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
                                    currentTheme === 'light'
                                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                        : 'bg-white hover:bg-gray-100 text-gray-900'
                                }`}
                            >
                                View More Reviews
                            </Link>
                        </div>
                    </div>
                </div>

                {/* FAQs Section */}
                <div className="py-16">
                    <div className="container mx-auto max-w-4xl px-4">
                        <div className="text-center mb-12">
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                                Frequently Asked Questions
                            </h2>
                            <p className={`text-lg ${
                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                            } max-w-2xl mx-auto`}>
                                Find answers to common questions about our background removal tool
                            </p>
                        </div>

                        {/* FAQs */}
                        <div className="space-y-4 mb-12">
                            {faqs.map((faq, index) => (
                                <div 
                                    key={index} 
                                    className={`${
                                        currentTheme === 'light'
                                            ? 'bg-white border border-gray-200 shadow-sm'
                                            : 'bg-gray-800 border border-gray-700 shadow-sm'
                                    } rounded-2xl overflow-hidden transition-all duration-300 ${
                                        openFaq === index 
                                            ? currentTheme === 'light'
                                                ? 'shadow-md'
                                                : 'shadow-lg' 
                                            : ''
                                    }`}
                                >
                                    <button 
                                        className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                        onClick={() => toggleFaq(index)}
                                        aria-expanded={openFaq === index}
                                    >
                                        <h3 className={`text-lg font-semibold pr-4 ${
                                            currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                        }`}>
                                            {faq.question}
                                        </h3>
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-all duration-300 ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-100'
                                                : 'bg-gray-700'
                                        } ${
                                            openFaq === index 
                                                ? currentTheme === 'light' 
                                                    ? 'bg-gray-900 text-white' 
                                                    : 'bg-white text-gray-900' 
                                                : currentTheme === 'light'
                                                    ? 'text-gray-600'
                                                    : 'text-gray-300'
                                        }`}>
                                            {openFaq === index ? 
                                                <LuMinus className="w-4 h-4" /> : 
                                                <LuPlus className="w-4 h-4" />
                                            }
                                        </div>
                                    </button>
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            openFaq === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                        ref={(el) => {
                                            contentRefs.current[index] = el;
                                        }}
                                        aria-hidden={openFaq !== index}
                                    >
                                        <div className="px-6 pb-6">
                                            <p className={`${
                                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                            } leading-relaxed`}>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center">
                            <Link 
                                href="/faqs"
                                className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
                                    currentTheme === 'light'
                                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                        : 'bg-white hover:bg-gray-100 text-gray-900'
                                }`}
                            >
                                View All FAQs
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-16">
                    <div className="container mx-auto max-w-4xl px-4">
                        <div className={`${
                            currentTheme === 'light'
                                ? 'bg-white border border-gray-200 shadow-sm'
                                : 'bg-gray-800 border border-gray-700 shadow-sm'
                        } rounded-2xl p-8 md:p-12 text-center`}>
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                                Ready to Try It Yourself?
                            </h2>
                            <p className={`text-lg mb-8 ${
                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                            } max-w-2xl mx-auto`}>
                                Our tool is easy to use, fast, and completely free. No account required.
                            </p>
                            <button 
                                onClick={() => dropzoneRef.current?.click()}
                                className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                                    currentTheme === 'light'
                                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                        : 'bg-white hover:bg-gray-100 text-gray-900'
                                }`}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation styles */}
            <style jsx global>{`
              @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
              }
              
              .animate-blob {
                animation: blob 7s infinite;
              }
              .animation-delay-1000 { animation-delay: 1s; }
              .animation-delay-2000 { animation-delay: 2s; }
              .animation-delay-3000 { animation-delay: 3s; }
              .animation-delay-4000 { animation-delay: 4s; }
              
              @keyframes float {
                0% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(-20px) translateX(10px); }
                100% { transform: translateY(0px) translateX(0px); }
              }
              
              @keyframes floatDelayed {
                0% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(20px) translateX(-10px); }
                100% { transform: translateY(0px) translateX(0px); }
              }
              
              @keyframes floatSlow {
                0% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(15px) translateX(15px); }
                100% { transform: translateY(0px) translateX(0px); }
              }
              
              @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              
              .animate-gradient {
                background-size: 200% 200%;
                animation: gradient 8s ease infinite;
              }
            `}</style>
        </>
    );
}
