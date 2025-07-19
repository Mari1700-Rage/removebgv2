import Script from 'next/script';

export default function YourComponent() {
    return (
        <>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4619589162374260"
                crossOrigin="anonymous"
            />

            {/* Your entire existing JSX code below */}
            <div className={`${
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
                            View More FAQs
                        </Link>
                    </div>
                </div>
            </div>

            {/* Ready Section */}
            <div className={`py-12 ${
                currentTheme === 'light' 
                    ? 'bg-gradient-to-br from-slate-50 to-gray-100' 
                    : 'bg-gradient-to-br from-slate-900 to-gray-900'
            }`}>
                <div className="container mx-auto max-w-6xl px-4 text-center">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                        currentTheme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                        Ready to remove your background?
                    </h2>
                    <button
                        onClick={() => dropzoneRef.current?.click()}
                        className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                            currentTheme === 'light'
                                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                : 'bg-white hover:bg-gray-100 text-gray-900'
                        }`}
                    >
                        Get Started Now
                    </button>
                </div>
            </div>
        </>
    );
}
