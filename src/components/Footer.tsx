import { RiGithubLine, RiInstagramLine, RiTwitterXLine, RiLinkedinLine, RiYoutubeLine, RiFacebookLine } from 'react-icons/ri';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    // After mounting, we can safely access the theme
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Use resolvedTheme if available, fallback to theme, and default to 'light' when not mounted yet
    const currentTheme = mounted ? resolvedTheme || theme : 'light';

    return (
        <footer className={`py-16 border-t ${
            currentTheme === 'light' 
                ? 'bg-gradient-to-br from-slate-50 to-gray-100 border-gray-200' 
                : 'bg-gradient-to-br from-slate-900 to-gray-900 border-gray-800'
        } transition-colors duration-200`}>
            <div className="container mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Logo & tagline */}
                    <div className="flex flex-col">
                        <div className="flex items-center mb-4">
                            <img
                                src="/logo.svg"
                                alt="Eraseto Logo"
                                className="h-8 w-auto"
                            />
                        </div>
                        <p className={`text-sm mb-6 ${
                            currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                            Remove backgrounds from images instantly with AI powered precision. Transform your photos with professional quality results in seconds, no design skills required.
                        </p>
                        
                        {/* Social links */}
                        <div className="flex gap-3 mt-auto">
                            {[
                                { Icon: RiTwitterXLine, url: "https://twitter.com" },
                                { Icon: RiInstagramLine, url: "https://instagram.com" },
                                { Icon: RiGithubLine, url: "https://github.com" },
                                { Icon: RiLinkedinLine, url: "https://linkedin.com" },
                                { Icon: RiYoutubeLine, url: "https://youtube.com" },
                                { Icon: RiFacebookLine, url: "https://facebook.com" }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Visit our ${social.Icon.name} page`}
                                    className={`h-10 w-10 flex items-center justify-center rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                                        currentTheme === 'light' 
                                            ? 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900' 
                                            : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <social.Icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-col">
                        <h4 className={`text-sm font-semibold mb-4 ${
                            currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                            Features
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: "40MB", label: "Max File Size", icon: "📁" },
                                { value: "Instant", label: "Processing", icon: "⚡" },
                                { value: "Custom", label: "Background", icon: "🎨" },
                                { value: "Flexible", label: "Crop & Resize", icon: "✂️" },
                            ].map((stat, index) => (
                                <div key={index} className={`flex items-center rounded-xl p-3 shadow-sm transition-all duration-300 hover:shadow-md ${
                                    currentTheme === 'light' 
                                        ? 'bg-white border border-gray-200' 
                                        : 'bg-gray-800 border border-gray-700'
                                }`}>
                                    <span className="mr-2 text-sm">{stat.icon}</span>
                                    <div>
                                        <span className={`text-xs font-bold block leading-tight ${
                                            currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                        }`}>
                                            {stat.value}
                                        </span>
                                        <span className={`text-[10px] leading-none ${
                                            currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                        }`}>
                                            {stat.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Links */}
                    <div className="flex flex-col md:items-end">
                        <h4 className={`text-sm font-semibold mb-4 md:text-right ${
                            currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                            Quick Links
                        </h4>
                        <div className="flex flex-col md:items-end gap-3 mb-4">
                            {[
                                { href: "/terms", text: "Terms of Service" },
                                { href: "/privacy-policy", text: "Privacy Policy" },
                                { href: "/cookies", text: "Cookies" }
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={`text-sm transition-colors duration-200 hover:underline underline-offset-2 ${
                                        currentTheme === 'light' 
                                            ? 'text-gray-600 hover:text-gray-900' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Divider */}
                <div className={`h-px mb-8 ${
                    currentTheme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
                }`}></div>
                
                {/* Copyright */}
                <div className={`text-xs text-center ${
                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                    <div className="mb-2">
                        ©{currentYear} <span className="font-medium">eraseto.com</span>. All Rights Reserved.
                    </div>
                    <div>
                        Made With ❤️ For Everyone
                    </div>
                </div>
            </div>
        </footer>
    );
}