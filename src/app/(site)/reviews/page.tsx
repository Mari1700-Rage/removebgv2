"use client"

import Link from "next/link";
import { LuStar } from "react-icons/lu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ReviewsPage() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    // After mounting, we can safely access the theme
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Use resolvedTheme if available, fallback to theme, and default to 'light' when not mounted yet
    const currentTheme = mounted ? resolvedTheme || theme : 'light';
    
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
        {
            name: "David Wilson",
            role: "Graphic Designer",
            content: "As a designer, I need pixel-perfect results. This tool consistently delivers clean edges and preserves fine details better than any other automated solution I've tried.",
            avatarUrl: "/testimonials/avatar4.webp", // Placeholder
            rating: 4
        },
        {
            name: "Jessica Park",
            role: "Marketing Director",
            content: "Our marketing team relies on this background remover for all our campaigns. It's intuitive, fast, and the batch processing feature is a huge time-saver.",
            avatarUrl: "/testimonials/avatar5.webp", // Placeholder
            rating: 5
        },
        {
            name: "Thomas Brown",
            role: "Real Estate Agent",
            content: "I use this tool to enhance property photos. The ability to quickly remove distracting backgrounds helps me create cleaner, more attractive listings.",
            avatarUrl: "/testimonials/avatar6.webp", // Placeholder
            rating: 4
        }
    ];

    return (
        <div className={`min-h-screen ${
            currentTheme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'
        } py-16`}>
            <div className="container mx-auto max-w-6xl px-4">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                        What our users are saying
                    </h1>
                    <p className={`text-lg ${
                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    } max-w-2xl mx-auto`}>
                        Thousands of professionals trust our background remover for their image editing needs
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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

                {/* CTA Section */}
                <div className={`${
                    currentTheme === 'light'
                        ? 'bg-white border border-gray-200 shadow-sm'
                        : 'bg-gray-800 border border-gray-700 shadow-sm'
                } rounded-2xl p-8 md:p-12 text-center`}>
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                        Join Thousands of Satisfied Users
                    </h2>
                    <p className={`text-lg mb-8 ${
                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    } max-w-2xl mx-auto`}>
                        Experience the power of our AI background remover for yourself. Try it now for free!
                    </p>
                    <Link 
                        href="/"
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
                    </Link>
                </div>
            </div>
        </div>
    );
} 