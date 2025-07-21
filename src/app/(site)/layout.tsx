'use client';

import { ReactNode } from 'react';
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareButton } from "@/components/ShareButton";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function SiteLayout({ children }: { children: ReactNode }) {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // After mounting, we can safely access the theme
    useEffect(() => {
        setMounted(true);
    }, []);

    // Use resolvedTheme if available, fallback to theme, and default to 'light' when not mounted yet
    const currentTheme = mounted ? resolvedTheme || theme : 'light';

    // Function to handle How-To navigation
    const handleHowToClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        
        if (pathname !== '/') {
            // If not on home page, navigate to home page with hash
            router.push('/#how-to');
        } else {
            // If on home page, just scroll to the section
            const howToSection = document.getElementById('how-to');
            if (howToSection) {
                howToSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <main className="relative flex min-h-dvh flex-col">
            {/* Modern Clean Header */}
            <header className={cn(
                'sticky top-0 z-50 transition-all duration-300 border-b',
                scrolled 
                    ? currentTheme === 'light' 
                        ? 'bg-white/95 backdrop-blur-xl border-gray-200/80 shadow-sm' 
                        : 'bg-gray-900/95 backdrop-blur-xl border-gray-800/80 shadow-sm'
                    : currentTheme === 'light'
                        ? 'bg-white/80 backdrop-blur-sm border-gray-100/50'
                        : 'bg-gray-900/80 backdrop-blur-sm border-gray-800/50'
            )}>
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <Link 
                                href='/' 
                                className="group flex items-center transition-all duration-200 hover:opacity-80"
                            >
                                <Image 
                                    src={currentTheme === 'dark' ? "/logo-white.svg" : "/logo.svg"} 
                                    alt="Eraseto Logo" 
                                    width={120} 
                                    height={40}
                                    className="h-6 sm:h-8 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation - Clean & Minimal */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a 
                                href="/#how-to"
                                className={`text-sm font-medium transition-colors duration-200 ${
                                    currentTheme === 'light' 
                                        ? 'text-gray-600 hover:text-gray-900' 
                                        : 'text-gray-300 hover:text-white'
                                }`}
                                onClick={handleHowToClick}
                            >
                                How to
                            </a>
                            <Link 
                                href="/faqs"
                                className={`text-sm font-medium transition-colors duration-200 ${
                                    currentTheme === 'light' 
                                        ? 'text-gray-600 hover:text-gray-900' 
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                FAQs
                            </Link>
                            <Link 
                                href="/reviews"
                                className={`text-sm font-medium transition-colors duration-200 ${
                                    currentTheme === 'light' 
                                        ? 'text-gray-600 hover:text-gray-900' 
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                Testimonials
                            </Link>
                            <Link 
                                href="/contact"
                                className={`text-sm font-medium transition-colors duration-200 ${
                                    currentTheme === 'light' 
                                        ? 'text-gray-600 hover:text-gray-900' 
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                Contact Us
                            </Link>
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Desktop Actions */}
                            <div className="hidden md:flex items-center gap-3">
                                {/* Buy me a coffee button */}
                                <a 
                                    href="https://ko-fi.com/eraseto1" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-[#FF5F5F] hover:bg-[#FF4444] text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                                >
                                    <Image 
                                        src="/kofi_symbol.svg" 
                                        alt="Ko-fi" 
                                        width={16} 
                                        height={16} 
                                        className="mr-2"
                                    />
                                    Buy me a coffee
                                </a>
                                <ShareButton />
                                <ThemeToggle />
                            </div>
                            
                            {/* Mobile Actions - Show donation button and theme toggle only */}
                            <div className="md:hidden flex items-center gap-2">
                                {/* Mobile Buy me a coffee button */}
                                <a 
                                    href="https://ko-fi.com/eraseto1" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-2 bg-[#FF5F5F] hover:bg-[#FF4444] active:bg-[#FF3333] text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <Image 
                                        src="/kofi_symbol.svg" 
                                        alt="Ko-fi" 
                                        width={14} 
                                        height={14} 
                                        className="mr-1.5"
                                    />
                                    <span className="hidden xs:inline">Buy me a coffee</span>
                                    <span className="xs:hidden">Donate</span>
                                </a>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            {children}
            <Footer />
        </main>
    );
}
