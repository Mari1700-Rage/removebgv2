"use client"

import { Metadata } from 'next';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

// Note: This would need to be handled differently in a real app
// For now, we'll export it as a regular component since we need client-side hooks
// export const metadata: Metadata = {
//     title: 'Cookie Policy | Eraseto',
//     description: 'Learn about how Eraseto uses cookies and similar technologies to improve your experience.',
// };

export default function CookiesPolicy() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    // After mounting, we can safely access the theme
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Use resolvedTheme if available, fallback to theme, and default to 'light' when not mounted yet
    const currentTheme = mounted ? resolvedTheme || theme : 'light';

    return (
        <>
            <Script 
                id="cookies-structured-data" 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Cookie Policy - Eraseto Background Remover",
                        "description": "Learn about how Eraseto uses cookies and similar technologies to improve your experience with our background removal service.",
                        "url": "https://eraseto.com/cookies",
                        "mainEntity": {
                            "@type": "Organization",
                            "name": "Eraseto",
                            "description": "Free online background removal tool"
                        }
                    })
                }}
            />
            
            <div className={`min-h-screen ${
                currentTheme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'
            } relative overflow-hidden`}>
                
                {/* Background Shapes - Same as home page */}
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

                {/* Content */}
                <div className="relative z-10 pt-20">
                    <div className="container mx-auto max-w-4xl px-4">
                        
                        {/* Header Section */}
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center mb-6">
                                <svg 
                                    className="w-16 h-16 mr-4" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
                                        fill="currentColor"
                                    />
                                </svg>
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                                    Cookie Policy
                                </h1>
                            </div>
                            
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Learn about how we use cookies and similar technologies to improve your experience with our background removal service.
                            </p>
                            
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                currentTheme === 'light'
                                    ? 'bg-gray-100 text-gray-600'
                                    : 'bg-gray-800 text-gray-300'
                            }`}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-12 mb-16">
                            
                            {/* Introduction Section */}
                            <section className={`${
                                currentTheme === 'light'
                                    ? 'bg-white border border-gray-200 shadow-sm'
                                    : 'bg-gray-800 border border-gray-700 shadow-sm'
                            } rounded-2xl p-8 transition-all duration-300 hover:shadow-md`}>
                                <div className="flex items-center mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                        currentTheme === 'light'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-900'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Introduction
                                    </h2>
                                </div>
                                <p className={`text-lg leading-relaxed ${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                }`}>
                                    This Cookie Policy explains how Eraseto uses cookies and similar technologies 
                                    to recognize you when you visit our website. It explains what these technologies 
                                    are and why we use them, as well as your rights to control our use of them. 
                                    We are committed to being transparent about how we collect and use data.
                                </p>
                            </section>

                            {/* What are Cookies Section */}
                            <section className={`${
                                currentTheme === 'light'
                                    ? 'bg-white border border-gray-200 shadow-sm'
                                    : 'bg-gray-800 border border-gray-700 shadow-sm'
                            } rounded-2xl p-8 transition-all duration-300 hover:shadow-md`}>
                                <div className="flex items-center mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                        currentTheme === 'light'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-900'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        What are Cookies?
                                    </h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className={`text-lg leading-relaxed ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        Cookies are small data files that are placed on your computer or mobile device when 
                                        you visit a website. They are widely used by website owners to make their websites 
                                        work, or work more efficiently, as well as to provide reporting information.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className={`${
                                            currentTheme === 'light'
                                                ? 'bg-blue-50 border border-blue-200'
                                                : 'bg-blue-900/20 border border-blue-700'
                                        } rounded-xl p-6`}>
                                            <div className="flex items-start space-x-3">
                                                <div className="text-2xl">🥇</div>
                                                <div>
                                                    <h3 className={`text-lg font-semibold mb-2 ${
                                                        currentTheme === 'light' ? 'text-blue-900' : 'text-blue-300'
                                                    }`}>
                                                        First-Party Cookies
                                                    </h3>
                                                    <p className={`${
                                                        currentTheme === 'light' ? 'text-blue-800' : 'text-blue-200'
                                                    }`}>
                                                        Cookies set by the website owner (Eraseto) to provide core functionality and improve your experience.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`${
                                            currentTheme === 'light'
                                                ? 'bg-purple-50 border border-purple-200'
                                                : 'bg-purple-900/20 border border-purple-700'
                                        } rounded-xl p-6`}>
                                            <div className="flex items-start space-x-3">
                                                <div className="text-2xl">🥉</div>
                                                <div>
                                                    <h3 className={`text-lg font-semibold mb-2 ${
                                                        currentTheme === 'light' ? 'text-purple-900' : 'text-purple-300'
                                                    }`}>
                                                        Third-Party Cookies
                                                    </h3>
                                                    <p className={`${
                                                        currentTheme === 'light' ? 'text-purple-800' : 'text-purple-200'
                                                    }`}>
                                                        Cookies set by external services we use to enhance functionality and analyze usage.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Types of Cookies Section */}
                            <section className={`${
                                currentTheme === 'light'
                                    ? 'bg-white border border-gray-200 shadow-sm'
                                    : 'bg-gray-800 border border-gray-700 shadow-sm'
                            } rounded-2xl p-8 transition-all duration-300 hover:shadow-md`}>
                                <div className="flex items-center mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                        currentTheme === 'light'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-900'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Types of Cookies We Use
                                    </h2>
                                </div>
                                
                                <div className="space-y-6">
                                    {/* Essential Cookies */}
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-red-50 border border-red-200'
                                            : 'bg-red-900/20 border border-red-700'
                                    } rounded-xl p-6 transition-all duration-300 hover:scale-105`}>
                                        <div className="flex items-start space-x-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                currentTheme === 'light'
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-red-800 text-red-300'
                                            }`}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`text-xl font-semibold mb-3 ${
                                                    currentTheme === 'light' ? 'text-red-900' : 'text-red-300'
                                                }`}>
                                                    🔒 Essential Cookies
                                                </h3>
                                                <p className={`leading-relaxed ${
                                                    currentTheme === 'light' ? 'text-red-800' : 'text-red-200'
                                                }`}>
                                                    These cookies are necessary for the website to function and cannot be switched off. 
                                                    They are usually only set in response to actions made by you which amount to a request 
                                                    for services, such as setting your privacy preferences, logging in, or filling in forms.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Cookies */}
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-yellow-50 border border-yellow-200'
                                            : 'bg-yellow-900/20 border border-yellow-700'
                                    } rounded-xl p-6 transition-all duration-300 hover:scale-105`}>
                                        <div className="flex items-start space-x-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                currentTheme === 'light'
                                                    ? 'bg-yellow-100 text-yellow-600'
                                                    : 'bg-yellow-800 text-yellow-300'
                                            }`}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`text-xl font-semibold mb-3 ${
                                                    currentTheme === 'light' ? 'text-yellow-900' : 'text-yellow-300'
                                                }`}>
                                                    📊 Performance Cookies
                                                </h3>
                                                <p className={`leading-relaxed ${
                                                    currentTheme === 'light' ? 'text-yellow-800' : 'text-yellow-200'
                                                }`}>
                                                    These cookies allow us to count visits and traffic sources so we can measure and 
                                                    improve the performance of our site. They help us to know which pages are the most 
                                                    and least popular and see how visitors move around the site.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Functional Cookies */}
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-green-900/20 border border-green-700'
                                    } rounded-xl p-6 transition-all duration-300 hover:scale-105`}>
                                        <div className="flex items-start space-x-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                currentTheme === 'light'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-green-800 text-green-300'
                                            }`}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`text-xl font-semibold mb-3 ${
                                                    currentTheme === 'light' ? 'text-green-900' : 'text-green-300'
                                                }`}>
                                                    ⚙️ Functional Cookies
                                                </h3>
                                                <p className={`leading-relaxed ${
                                                    currentTheme === 'light' ? 'text-green-800' : 'text-green-200'
                                                }`}>
                                                    These cookies enable the website to provide enhanced functionality and personalization. 
                                                    They may be set by us or by third-party providers whose services we have added to our pages. 
                                                    If you do not allow these cookies, some or all of these services may not function properly.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Cookie Control Section */}
                            <section className={`${
                                currentTheme === 'light'
                                    ? 'bg-white border border-gray-200 shadow-sm'
                                    : 'bg-gray-800 border border-gray-700 shadow-sm'
                            } rounded-2xl p-8 transition-all duration-300 hover:shadow-md`}>
                                <div className="flex items-center mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                        currentTheme === 'light'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-900'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        How Can You Control Cookies?
                                    </h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className={`text-lg leading-relaxed ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        You can set or amend your web browser controls to accept or refuse cookies. If you choose 
                                        to reject cookies, you may still use our website though your access to some functionality 
                                        and areas of our website may be restricted.
                                    </p>
                                    
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-gray-50 border border-gray-100'
                                            : 'bg-gray-700 border border-gray-600'
                                    } rounded-xl p-6`}>
                                        <h3 className={`text-lg font-semibold mb-4 ${
                                            currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                        }`}>
                                            🌐 How to manage cookies in major browsers:
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { browser: "Chrome", icon: "🔵", path: "Settings → Privacy and Security → Cookies" },
                                                { browser: "Firefox", icon: "🦊", path: "Options → Privacy & Security → Cookies" },
                                                { browser: "Safari", icon: "🧭", path: "Preferences → Privacy → Cookies" },
                                                { browser: "Edge", icon: "🌊", path: "Settings → Privacy & Security → Cookies" }
                                            ].map((item, index) => (
                                                <div key={index} className={`${
                                                    currentTheme === 'light'
                                                        ? 'bg-white border border-gray-200'
                                                        : 'bg-gray-600 border border-gray-500'
                                                } rounded-lg p-4 transition-all duration-300 hover:scale-105`}>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-2xl">{item.icon}</span>
                                                        <div>
                                                            <h4 className={`font-semibold ${
                                                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                                            }`}>
                                                                {item.browser}
                                                            </h4>
                                                            <p className={`text-sm ${
                                                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                            }`}>
                                                                {item.path}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Updates Section */}
                            <section className={`${
                                currentTheme === 'light'
                                    ? 'bg-white border border-gray-200 shadow-sm'
                                    : 'bg-gray-800 border border-gray-700 shadow-sm'
                            } rounded-2xl p-8 transition-all duration-300 hover:shadow-md`}>
                                <div className="flex items-center mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                        currentTheme === 'light'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-900'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Updates to This Policy
                                    </h2>
                                </div>
                                
                                <p className={`text-lg leading-relaxed ${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                }`}>
                                    We may update this Cookie Policy from time to time in order to reflect changes to the cookies 
                                    we use or for other operational, legal, or regulatory reasons. Please re-visit this Cookie 
                                    Policy regularly to stay informed about our use of cookies and related technologies. We will 
                                    notify users of any significant changes through our website or via email.
                                </p>
                            </section>

                            {/* Contact Section */}
                            <section className={`${
                                currentTheme === 'light'
                                    ? 'bg-white border border-gray-200 shadow-sm'
                                    : 'bg-gray-800 border border-gray-700 shadow-sm'
                            } rounded-2xl p-8 transition-all duration-300 hover:shadow-md`}>
                                <div className="flex items-center mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                        currentTheme === 'light'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-900'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Contact Us
                                    </h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className={`text-lg leading-relaxed ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        If you have any questions about our use of cookies or other technologies, please contact us at:
                                    </p>
                                    
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-gray-50 border border-gray-100'
                                            : 'bg-gray-700 border border-gray-600'
                                    } rounded-xl p-6`}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    currentTheme === 'light'
                                                        ? 'bg-gray-200 text-gray-600'
                                                        : 'bg-gray-600 text-gray-300'
                                                }`}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${
                                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                                    }`}>
                                                        Email
                                                    </p>
                                                    <p className={`${
                                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                    }`}>
                                                        privacy@eraseto.com
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    currentTheme === 'light'
                                                        ? 'bg-gray-200 text-gray-600'
                                                        : 'bg-gray-600 text-gray-300'
                                                }`}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${
                                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                                    }`}>
                                                        Address
                                                    </p>
                                                    <p className={`${
                                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                    }`}>
                                                        123 Main St, Anytown, USA
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link 
                                            href="/privacy-policy"
                                            className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
                                                currentTheme === 'light'
                                                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                                    : 'bg-white hover:bg-gray-100 text-gray-900'
                                            }`}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Privacy Policy
                                        </Link>
                                        
                                        <Link 
                                            href="/terms"
                                            className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
                                                currentTheme === 'light'
                                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                                            }`}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Terms of Service
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation styles - Same as home page */}
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
            `}</style>
        </>
    );
} 