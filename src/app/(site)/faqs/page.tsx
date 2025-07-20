"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LuPlus, LuMinus } from "react-icons/lu";
import Script from "next/script";
import { useTheme } from "next-themes";

export default function FAQsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (typeof window !== "undefined") {
            try {
                // Ensure adsbygoogle exists
                if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
                    window.adsbygoogle.push({});
                }
            } catch (e) {
                console.error("AdSense error:", e);
            }
        }
    }, []);

    const currentTheme = mounted ? resolvedTheme || theme : 'light';

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

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
        {
            question: "What is the maximum file size supported?",
            answer: "You can upload images up to 5000x5000 pixels in resolution. This should be sufficient for most uses including professional photography and e-commerce product images."
        },
        {
            question: "Do you store my uploaded images?",
            answer: "We only store your images temporarily while processing them. After you download your processed images, they're automatically deleted from our servers to ensure your privacy."
        },
        {
            question: "Can I remove backgrounds from images with multiple subjects?",
            answer: "Yes, our tool can handle images with multiple subjects. The AI will detect all foreground elements and remove the background accordingly."
        }
    ];

    return (
        <>
            {/* JSON-LD FAQ Schema */}
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

            {/* Google AdSense Script */}
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4619589162374260"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />

            <div className={`min-h-screen ${currentTheme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'} py-16`}>
                <div className="container mx-auto max-w-4xl px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${currentTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            Frequently Asked Questions
                        </h1>
                        <p className={`text-lg ${currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-2xl mx-auto`}>
                            Find answers to common questions about our background removal tool
                        </p>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-4 mb-12">
                        {faqs.map((faq, index) => (
                            <div key={index}
                                className={`${
                                    currentTheme === 'light'
                                        ? 'bg-white border border-gray-200 shadow-sm'
                                        : 'bg-gray-800 border border-gray-700 shadow-sm'
                                } rounded-2xl overflow-hidden transition-all duration-300 ${
                                    openFaq === index ? 'shadow-md' : ''
                                }`}
                            >
                                <button
                                    className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                    onClick={() => toggleFaq(index)}
                                    aria-expanded={openFaq === index}
                                >
                                    <h3 className={`text-lg font-semibold pr-4 ${currentTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                        {faq.question}
                                    </h3>
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-all duration-300 ${
                                            openFaq === index
                                                ? currentTheme === 'light'
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-white text-gray-900'
                                                : currentTheme === 'light'
                                                    ? 'bg-gray-100 text-gray-600'
                                                    : 'bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        {openFaq === index ? <LuMinus className="w-4 h-4" /> : <LuPlus className="w-4 h-4" />}
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
                                        <p className={`${currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'} leading-relaxed`}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div
                        className={`${
                            currentTheme === 'light'
                                ? 'bg-white border border-gray-200 shadow-sm'
                                : 'bg-gray-800 border border-gray-700 shadow-sm'
                        } rounded-2xl p-8 md:p-12 text-center`}
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${currentTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            Still Have Questions?
                        </h2>
                        <p className={`text-lg mb-8 ${currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-2xl mx-auto`}>
                            If you couldn't find the answer you need, feel free to reach out to our support team
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/contact"
                                className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
                                    currentTheme === 'light'
                                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                        : 'bg-white hover:bg-gray-100 text-gray-900'
                                }`}
                            >
                                Contact Support
                            </Link>
                            <Link
                                href="/"
                                className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
                                    currentTheme === 'light'
                                        ? 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'
                                        : 'bg-gray-700 border border-gray-600 text-white hover:bg-gray-600'
                                }`}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Try It Now
                            </Link>
                        </div>
                    </div>

                    {/* AdSense Unit */}
                    <div className="mt-12 text-center">
                        <ins
                            className="adsbygoogle"
                            style={{ display: "block" }}
                            data-ad-client="ca-pub-4619589162374260"
                            data-ad-slot="YOUR_SLOT_ID"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        ></ins>
                    </div>
                </div>
            </div>
        </>
    );
}
