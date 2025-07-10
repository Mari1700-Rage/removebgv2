"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuMail, LuMapPin, LuSend, LuChevronRight, LuPhone, LuClock } from "react-icons/lu";
import { useTheme } from "next-themes";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    // After mounting, we can safely access the theme
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Use resolvedTheme if available, fallback to theme, and default to 'light' when not mounted yet
    const currentTheme = mounted ? resolvedTheme || theme : 'light';
    const isLight = currentTheme === 'light';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Here you would typically send the form data to your backend
        // For now, we'll simulate a successful submission
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
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

            {/* Contact Section */}
            <div className="relative z-10 pt-20">
                <div className="container mx-auto max-w-7xl px-4">
                    
                    {/* Main Title */}
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center mb-6">
                           
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                                Contact Us
                            </h1>
                        </div>
                        
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
                            Have questions about our background remover? We're here to help you get the most out of our tool.
                        </p>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
                        
                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div className={`${
                                currentTheme === 'light'
                                    ? 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                                    : 'bg-gray-800 border border-gray-700 shadow-sm hover:shadow-lg'
                            } rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1`}>
                                <h2 className={`text-2xl font-bold mb-6 ${
                                    currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                }`}>
                                    Get in Touch
                                </h2>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-white text-gray-900'
                                        }`}>
                                            <LuMail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-lg ${
                                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                            }`}>
                                                Email
                                            </h3>
                                            <p className={`${
                                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                            }`}>
                                                support@eraseto.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-white text-gray-900'
                                        }`}>
                                            <LuClock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-lg ${
                                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                            }`}>
                                                Response Time
                                            </h3>
                                            <p className={`${
                                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                            }`}>
                                                Within 24 hours
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-white text-gray-900'
                                        }`}>
                                            <LuMapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-lg ${
                                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                            }`}>
                                                Location
                                            </h3>
                                            <p className={`${
                                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                            }`}>
                                                Remote - Worldwide
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className={`${
                                currentTheme === 'light'
                                    ? 'bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200'
                                    : 'bg-gradient-to-br from-slate-900 to-gray-900 border border-gray-700'
                            } rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1`}>
                                <h3 className={`text-xl font-bold mb-4 ${
                                    currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                                }`}>
                                    Need Quick Help?
                                </h3>
                                <p className={`${
                                    currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                } mb-6 leading-relaxed`}>
                                    Check out our comprehensive guides and frequently asked questions before reaching out.
                                </p>
                                <div className="space-y-3">
                                    <Link 
                                        href="/faqs"
                                        className={`inline-flex items-center justify-center w-full px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                                : 'bg-white hover:bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        View FAQs
                                        <LuChevronRight className="ml-2 w-4 h-4" />
                                    </Link>
                                    <Link 
                                        href="/#how-to"
                                        className={`inline-flex items-center justify-center w-full px-6 py-3 font-medium rounded-xl transition-all duration-300 border-2 ${
                                            currentTheme === 'light'
                                                ? 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                                                : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:bg-gray-800'
                                        }`}
                                    >
                                        How to Use
                                        <LuChevronRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className={`${
                            currentTheme === 'light'
                                ? 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                                : 'bg-gray-800 border border-gray-700 shadow-sm hover:shadow-lg'
                        } rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1`}>
                            <h2 className={`text-2xl font-bold mb-6 ${
                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                                Send us a Message
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                                        currentTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                    }`}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white'
                                                : 'bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:bg-gray-800'
                                        }`}
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                                        currentTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                    }`}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white'
                                                : 'bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:bg-gray-800'
                                        }`}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${
                                        currentTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                    }`}>
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white'
                                                : 'bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:bg-gray-800'
                                        }`}
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className={`block text-sm font-medium mb-2 ${
                                        currentTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                    }`}>
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 resize-none ${
                                            currentTheme === 'light'
                                                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white'
                                                : 'bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:bg-gray-800'
                                        }`}
                                        placeholder="Tell us about your question or issue..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex items-center justify-center px-8 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                                        isSubmitting
                                            ? currentTheme === 'light'
                                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                                : 'bg-gray-700 cursor-not-allowed text-gray-400'
                                            : currentTheme === 'light'
                                                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                                : 'bg-white hover:bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <LuSend className="w-5 h-5 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </button>

                                {submitStatus === 'success' && (
                                    <div className={`rounded-xl p-4 text-center ${
                                        currentTheme === 'light'
                                            ? 'bg-green-50 border border-green-200 text-green-800'
                                            : 'bg-green-900/20 border border-green-700 text-green-400'
                                    }`}>
                                        <div className="flex items-center justify-center mb-2">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Message Sent Successfully!
                                        </div>
                                        <p className="text-sm">
                                            Thank you for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className={`rounded-xl p-4 text-center ${
                                        currentTheme === 'light'
                                            ? 'bg-red-50 border border-red-200 text-red-800'
                                            : 'bg-red-900/20 border border-red-700 text-red-400'
                                    }`}>
                                        <div className="flex items-center justify-center mb-2">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Something went wrong
                                        </div>
                                        <p className="text-sm">
                                            Please try again later or contact us directly at support@eraseto.com
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mb-16">
                        <div className={`${
                            currentTheme === 'light'
                                ? 'bg-white border border-gray-200 shadow-sm'
                                : 'bg-gray-800 border border-gray-700 shadow-sm'
                        } rounded-2xl p-8 md:p-12 text-center`}>
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                                currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                                Ready to Remove Backgrounds?
                            </h2>
                            <p className={`text-lg mb-8 ${
                                currentTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                            } max-w-2xl mx-auto`}>
                                Try our free background remover tool while you wait for our response. No account required.
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
                                Try Background Remover
                            </Link>
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
              .animation-delay-2000 { animation-delay: 2s; }
              .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </div>
    );
} 