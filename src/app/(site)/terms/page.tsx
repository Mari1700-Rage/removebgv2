"use client"

import { Metadata } from 'next';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

// Note: This would need to be handled differently in a real app
// For now, we'll export it as a regular component since we need client-side hooks
// export const metadata: Metadata = {
//     title: 'Terms of Service | Eraseto',
//     description: 'Read our Terms of Service to understand the rules and guidelines for using Eraseto.',
// };

export default function TermsOfService() {
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
                id="terms-structured-data" 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Terms of Service - Eraseto Background Remover",
                        "description": "Read our Terms of Service to understand the rules and guidelines for using Eraseto background removal service.",
                        "url": "https://eraseto.com/terms",
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
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                                    Terms of Service
                                </h1>
                            </div>
                            
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Please read these terms carefully before using our background removal service. By using Eraseto, you agree to these terms.
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
                            
                            {/* Acceptance of Terms Section */}
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
                                        <span className="text-xl font-bold">1</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Acceptance of Terms
                                    </h2>
                                </div>
                                <p className={`text-lg leading-relaxed ${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                }`}>
                                    By accessing and using Eraseto ("the Service"), you accept and agree to be bound by the terms 
                                    and conditions of this agreement. If you do not agree to these terms, please do not use our Service. 
                                    Your continued use of the Service constitutes acceptance of any updates to these terms.
                                </p>
                            </section>

                            {/* Description of Service Section */}
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
                                        <span className="text-xl font-bold">2</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Description of Service
                                    </h2>
                                </div>
                                
                                <div className="space-y-4">
                                    <p className={`text-lg leading-relaxed ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        Eraseto is an AI-powered background removal service that allows users to remove backgrounds 
                                        from images. The Service is provided "as is" and may be updated or modified at any time 
                                        without prior notice.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { icon: "🤖", title: "AI-Powered", desc: "Advanced machine learning algorithms" },
                                            { icon: "⚡", title: "Fast Processing", desc: "Instant background removal" },
                                            { icon: "🆓", title: "Free Service", desc: "No cost for basic usage" }
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
                                </div>
                            </section>

                            {/* User Obligations Section */}
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
                                        <span className="text-xl font-bold">3</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        User Obligations
                                    </h2>
                                </div>
                                
                                <div className="space-y-4">
                                    <p className={`text-lg leading-relaxed ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        By using our Service, you agree to:
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { icon: "✅", title: "Provide accurate information", desc: "Complete and truthful data when using the Service" },
                                            { icon: "⚖️", title: "Use for lawful purposes", desc: "Only legal and legitimate use cases" },
                                            { icon: "🚫", title: "Respect intellectual property", desc: "No copyright or trademark infringement" },
                                            { icon: "🔒", title: "No circumvention attempts", desc: "Respect technical limitations and security" },
                                            { icon: "🛡️", title: "No harmful content", desc: "No malware or malicious code distribution" },
                                            { icon: "📋", title: "Follow guidelines", desc: "Comply with all service terms and policies" }
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
                                </div>
                            </section>

                            {/* Intellectual Property Rights Section */}
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
                                        <span className="text-xl font-bold">4</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Intellectual Property Rights
                                    </h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-green-900/20 border border-green-700'
                                    } rounded-xl p-6`}>
                                        <div className="flex items-start space-x-3">
                                            <div className="text-2xl">👤</div>
                                            <div>
                                                <h3 className={`text-lg font-semibold mb-2 ${
                                                    currentTheme === 'light' ? 'text-green-900' : 'text-green-300'
                                                }`}>
                                                    Your Content Rights
                                                </h3>
                                                <p className={`${
                                                    currentTheme === 'light' ? 'text-green-800' : 'text-green-200'
                                                }`}>
                                                    You retain all rights to your content. By uploading content to our Service, you grant 
                                                    Eraseto a limited license to process and modify the content solely for the purpose of 
                                                    providing the background removal service.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-blue-50 border border-blue-200'
                                            : 'bg-blue-900/20 border border-blue-700'
                                    } rounded-xl p-6`}>
                                        <div className="flex items-start space-x-3">
                                            <div className="text-2xl">🏢</div>
                                            <div>
                                                <h3 className={`text-lg font-semibold mb-2 ${
                                                    currentTheme === 'light' ? 'text-blue-900' : 'text-blue-300'
                                                }`}>
                                                    Our Service Rights
                                                </h3>
                                                <p className={`${
                                                    currentTheme === 'light' ? 'text-blue-800' : 'text-blue-200'
                                                }`}>
                                                    The Service's software, design, and technology are protected by copyright, trademark, 
                                                    and other laws. Our trademarks and trade dress may not be used without our prior 
                                                    written permission.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Privacy and Data Protection Section */}
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
                                        <span className="text-xl font-bold">5</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Privacy and Data Protection
                                    </h2>
                                </div>
                                
                                <div className="space-y-4">
                                    <p className={`text-lg leading-relaxed ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        Your privacy is important to us. Our use of your personal information is governed by our 
                                        Privacy Policy and Cookie Policy. By using the Service, you agree to our collection and 
                                        use of information as described in these policies.
                                    </p>
                                    
                                    <div className="flex justify-center">
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
                                            Read Privacy Policy
                                        </Link>
                                    </div>
                                </div>
                            </section>

                            {/* Limitation of Liability Section */}
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
                                        <span className="text-xl font-bold">6</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Limitation of Liability
                                    </h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className={`text-lg leading-relaxed ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        To the maximum extent permitted by law, Eraseto shall not be liable for any indirect, 
                                        incidental, special, consequential, or punitive damages, or any loss of profits or 
                                        revenues, whether incurred directly or indirectly.
                                    </p>
                                    
                                    <div className={`${
                                        currentTheme === 'light'
                                            ? 'bg-yellow-50 border border-yellow-200'
                                            : 'bg-yellow-900/20 border border-yellow-700'
                                    } rounded-xl p-6`}>
                                        <h3 className={`text-lg font-semibold mb-3 ${
                                            currentTheme === 'light' ? 'text-yellow-900' : 'text-yellow-300'
                                        }`}>
                                            ⚠️ Important Disclaimers
                                        </h3>
                                        <p className={`mb-3 ${
                                            currentTheme === 'light' ? 'text-yellow-800' : 'text-yellow-200'
                                        }`}>
                                            We do not guarantee that:
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {[
                                                { icon: "🔧", text: "The Service will be error-free or uninterrupted" },
                                                { icon: "🎯", text: "Any specific results will be achieved through the Service" },
                                                { icon: "💾", text: "Files will be permanently stored or backed up" }
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-2">
                                                    <span className="text-lg">{item.icon}</span>
                                                    <span className={`text-sm ${
                                                        currentTheme === 'light' ? 'text-yellow-700' : 'text-yellow-100'
                                                    }`}>
                                                        {item.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Service Modifications Section */}
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
                                        <span className="text-xl font-bold">7</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Modifications to Service
                                    </h2>
                                </div>
                                
                                <p className={`text-lg leading-relaxed ${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                }`}>
                                    We reserve the right to modify or discontinue the Service at any time, temporarily or 
                                    permanently, with or without notice. We shall not be liable to you or any third party 
                                    for any modification, suspension, or discontinuance of the Service. We strive to provide 
                                    advance notice when possible for major changes.
                                </p>
                            </section>

                            {/* Termination Section */}
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
                                        <span className="text-xl font-bold">8</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Termination
                                    </h2>
                                </div>
                                
                                <p className={`text-lg leading-relaxed ${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                }`}>
                                    We may terminate or suspend your access to the Service immediately, without prior notice 
                                    or liability, for any reason whatsoever, including without limitation if you breach these Terms. 
                                    Upon termination, your right to use the Service will cease immediately.
                                </p>
                            </section>

                            {/* Governing Law Section */}
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
                                        <span className="text-xl font-bold">9</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Governing Law
                                    </h2>
                                </div>
                                
                                <p className={`text-lg leading-relaxed ${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                }`}>
                                    These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                                    in which WEB PROJECT SOLUTIONS LTD operates, without regard to its conflict of law provisions. 
                                    Any disputes arising from these terms will be resolved in the appropriate courts of that jurisdiction.
                                </p>
                            </section>

                            {/* Contact Information Section */}
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
                                        <span className="text-xl font-bold">10</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold ${
                                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Contact Information
                                    </h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className={`text-lg leading-relaxed ${
                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                        For any questions about these Terms, please contact us at:
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
                                                        Legal Email
                                                    </p>
                                                    <p className={`${
                                                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                    }`}>
                                                        legal@eraseto.com
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