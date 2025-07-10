'use client';

import { ReactNode } from 'react';
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { LuHome, LuMenu, LuX, LuChevronDown } from "react-icons/lu";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function SiteLayout({ children }: { children: ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        
        // Close mobile menu if open
        setIsMobileMenuOpen(false);
    };

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

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
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
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
                                    className="h-8 w-auto"
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
                        <div className="flex items-center gap-4">
                            {/* Desktop Actions */}
                            <div className="hidden md:flex items-center gap-3">
                                {/* Buy me a coffee button */}
                                <a 
                                    href="https://ko-fi.com/eraseto" 
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
                            
                            {/* Mobile Menu Button */}
                            <div className="md:hidden">
                                <button 
                                    type="button" 
                                    className={`p-2 rounded-lg transition-colors duration-200 ${
                                        currentTheme === 'light' 
                                            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(true)}
                                >
                                    <LuMenu className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        
                        {/* Mobile Menu Panel */}
                        <div className={`fixed inset-y-0 right-0 w-full max-w-sm ${
                            currentTheme === 'light' ? 'bg-white' : 'bg-gray-900'
                        } shadow-xl`}>
                            <div className="flex flex-col h-full">
                                {/* Mobile Header */}
                                <div className={`flex items-center justify-between px-6 py-4 border-b ${
                                    currentTheme === 'light' ? 'border-gray-200' : 'border-gray-800'
                                }`}>
                                    <div className="flex items-center">
                                        <Image 
                                            src={currentTheme === 'dark' ? "/logo-white.svg" : "/logo.svg"} 
                                            alt="Eraseto Logo" 
                                            width={120} 
                                            height={40}
                                            className="h-8 w-auto"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className={`p-2 rounded-lg transition-colors duration-200 ${
                                            currentTheme === 'light' 
                                                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                                                : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <LuX className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                {/* Mobile Navigation Links */}
                                <div className="flex flex-col px-6 py-8 space-y-1">
                                    <a 
                                        href="/#how-to"
                                        className={`px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                                            currentTheme === 'light' 
                                                ? 'text-gray-900 hover:bg-gray-100' 
                                                : 'text-white hover:bg-gray-800'
                                        }`}
                                        onClick={handleHowToClick}
                                    >
                                        How to
                                    </a>
                                    <Link 
                                        href="/faqs"
                                        className={`px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                                            currentTheme === 'light' 
                                                ? 'text-gray-900 hover:bg-gray-100' 
                                                : 'text-white hover:bg-gray-800'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        FAQs
                                    </Link>
                                    <Link 
                                        href="/reviews"
                                        className={`px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                                            currentTheme === 'light' 
                                                ? 'text-gray-900 hover:bg-gray-100' 
                                                : 'text-white hover:bg-gray-800'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Testimonials
                                    </Link>
                                    <Link 
                                        href="/contact"
                                        className={`px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                                            currentTheme === 'light' 
                                                ? 'text-gray-900 hover:bg-gray-100' 
                                                : 'text-white hover:bg-gray-800'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Contact Us
                                    </Link>
                                </div>
                                
                                {/* Mobile Footer */}
                                <div className={`mt-auto px-6 py-6 border-t ${
                                    currentTheme === 'light' ? 'border-gray-200' : 'border-gray-800'
                                }`}>
                                    {/* Buy me a coffee button for mobile */}
                                    <div className="mb-4">
                                        <a 
                                            href="https://ko-fi.com/eraseto" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#FF5F5F] hover:bg-[#FF4444] text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                                            onClick={() => setIsMobileMenuOpen(false)}
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
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${
                                            currentTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                            © 2024 Eraseto
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <ShareButton />
                                            <ThemeToggle />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            
            {children}
            <Footer />
        </main>
    );
}