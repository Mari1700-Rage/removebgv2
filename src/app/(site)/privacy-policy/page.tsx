"use client"

import { Metadata } from 'next';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

// Note: This would need to be handled differently in a real app
// For now, we'll export it as a regular component since we need client-side hooks
// export const metadata: Metadata = {
//     title: 'Privacy Policy | Eraseto',
//     description: 'Privacy Policy for Eraseto - Learn how we handle and protect your data.',
// };

export default function PrivacyPolicy() {
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
                id="privacy-structured-data" 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Privacy Policy - Eraseto Background Remover",
                        "description": "Privacy Policy for Eraseto - Learn how we handle and protect your data when using our background removal service.",
                        "url": "https://eraseto.com/privacy-policy",
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
                                    <path d="M12 2C13.1 2 14 2.9 14 4V6H18C19.1 6 20 6.9 20 8V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V8C4 6.9 4.9 6 6 6H10V4C10 2.9 10.9 2 12 2ZM12 7C10.9 7 10 7.9 10 9S10.9 11 12 11 14 10.1 14 9 13.1 7 12 7Z" 
                                    fill="currentColor"
                                />
                                </svg>
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                                    Privacy Policy
                                </h1>
                            </div>
                            
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Your privacy matters to us. Learn how we handle and protect your data when using our background removal service.
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
                                    At Eraseto, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                                    disclose, and safeguard your information when you use our background removal service. We are 
                                    committed to protecting your personal data and being transparent about our practices.
                                </p>
                            </section>

                            {/* Information We Collect Section */}
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Information We Collect
                                    </h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-gray-50 border border-gray-100'
                                            : 'bg-gray-700 border border-gray-600'
                                    } rounded-xl p-6`}>
                                        <h3 className={`text-xl font-semibold mb-3 ${
                                            currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                        }`}>
                                            📸 Images
                                        </h3>
                                        <p className={`leading-relaxed ${
                                            currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                        }`}>
                                            When you use our service, we temporarily process the images you upload for background removal. 
                                            These images are automatically deleted from our servers after processing is complete and are never 
                                            stored permanently or shared with third parties.
                                        </p>
                                    </div>
                                    
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-gray-50 border border-gray-100'
                                            : 'bg-gray-700 border border-gray-600'
                                    } rounded-xl p-6`}>
                                        <h3 className={`text-xl font-semibold mb-3 ${
                                            currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                        }`}>
                                            📊 Usage Data
                                        </h3>
                                        <p className={`leading-relaxed ${
                                            currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                        }`}>
                                            We collect anonymous usage data such as browser type, device information, and interaction 
                                            patterns with our service. This helps us improve user experience and service performance 
                                            without identifying individual users.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* How We Use Your Information Section */}
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        How We Use Your Information
                                    </h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { icon: "🛠️", title: "Service Provision", desc: "To provide and maintain our background removal service" },
                                        { icon: "🔧", title: "Technical Issues", desc: "To detect, prevent, and address technical problems" },
                                        { icon: "🎯", title: "Algorithm Improvement", desc: "To enhance our background removal AI accuracy" },
                                        { icon: "📈", title: "User Experience", desc: "To analyze usage patterns and optimize performance" }
                                    ].map((item, index) => (
                                        <div key={index} className={`${
                                            currentTheme === 'light'
                                                ? 'bg-gray-50 border border-gray-100'
                                                : 'bg-gray-700 border border-gray-600'
                                        } rounded-xl p-4 transition-all duration-300 hover:scale-105`}>
                                            <div className="flex items-start space-x-3">
                                                <div className="text-2xl">{item.icon}</div>
                                                <div>
                                                    <h3 className={`font-semibold mb-1 ${
                                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                                    }`}>
                                                        {item.title}
                                                    </h3>
                                                    <p className={`text-sm ${
                                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                    }`}>
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Data Security Section */}
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Data Security
                                    </h2>
                                </div>
                                
                                <div className="space-y-4">
                                    <p className={`text-lg leading-relaxed ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        We implement appropriate technical and organizational measures to protect your data, including:
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { icon: "🔐", title: "Encryption", desc: "Data encrypted in transit and at rest" },
                                            { icon: "🗑️", title: "Auto-Delete", desc: "Images automatically deleted after processing" },
                                            { icon: "🛡️", title: "Secure Servers", desc: "Industry-standard security protocols" }
                                        ].map((item, index) => (
                                            <div key={index} className={`${
                                                currentTheme === 'light'
                                                    ? 'bg-gray-50 border border-gray-100'
                                                    : 'bg-gray-700 border border-gray-600'
                                            } rounded-xl p-4 text-center`}>
                                                <div className="text-3xl mb-2">{item.icon}</div>
                                                <h3 className={`font-semibold mb-1 ${
                                                    currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                                }`}>
                                                    {item.title}
                                                </h3>
                                                <p className={`text-sm ${
                                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                }`}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                                            : 'bg-yellow-900/20 border border-yellow-700 text-yellow-300'
                                    } rounded-xl p-4 mt-4`}>
                                        <div className="flex items-start space-x-3">
                                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <p className="text-sm">
                                                <strong>Important:</strong> While we implement strong security measures, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security but are committed to protecting your data.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Your Rights Section */}
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Your Rights
                                    </h2>
                                </div>
                                
                                <p className={`text-lg leading-relaxed mb-6 ${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                }`}>
                                    You have the following rights regarding your personal data:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { icon: "👁️", title: "Access", desc: "View your personal information we hold" },
                                        { icon: "🗑️", title: "Deletion", desc: "Request deletion of your data" },
                                        { icon: "✋", title: "Object", desc: "Object to processing of your data" },
                                        { icon: "📦", title: "Portability", desc: "Request data in a portable format" }
                                    ].map((right, index) => (
                                        <div key={index} className={`${
                                            currentTheme === 'light'
                                                ? 'bg-gray-50 border border-gray-100'
                                                : 'bg-gray-700 border border-gray-600'
                                        } rounded-xl p-4 transition-all duration-300 hover:scale-105`}>
                                            <div className="flex items-start space-x-3">
                                                <div className="text-2xl">{right.icon}</div>
                                                <div>
                                                    <h3 className={`font-semibold mb-1 ${
                                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                                    }`}>
                                                        {right.title}
                                                    </h3>
                                                    <p className={`text-sm ${
                                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                    }`}>
                                                        {right.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Changes to Policy Section */}
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
                                        Changes to This Privacy Policy
                                    </h2>
                                </div>
                                
                                <p className={`text-lg leading-relaxed ${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                }`}>
                                    We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
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
                                
                                <p className={`text-lg leading-relaxed mb-6 ${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                }`}>
                                    If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us:
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