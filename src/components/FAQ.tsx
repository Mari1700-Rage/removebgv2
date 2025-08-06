import { useState } from 'react';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How does the background removal work?",
            answer: "Our AI technology makes background removal effortless! Simply upload your image, and our tool will instantly detect and remove the background - even handling tricky details like hair and transparent objects. Get professional results with just one click."
        },
        {
            question: "What image formats are supported?",
            answer: "We support JPEG, JPG, WEBP, and PNG files up to 40MB in size. For best results, use clear, well-lit images with good contrast between the subject and background."
        },
        {
            question: "Is there a limit to how many images I can process?",
            answer: "No limits! Process as many images as you need - it's completely free with no daily restrictions."
        },
        {
            question: "Can I add a custom background after removal?",
            answer: "Yes! After removal, you can make the background transparent (perfect for logos and products) or choose from our collection of solid colors. Perfect for e-commerce or social media content."
        },
        {
            question: "What's the quality of the output image?",
            answer: "Your processed image will maintain the same high quality as the original! There's no loss in resolution or dimensions, and we ensure precise edge detection - even for tricky areas like hair. The output is perfect for professional use, from e-commerce to print."
        },
        {
            question: "Do I need to create an account to use the tool?",
            answer: "No account needed! Simply upload your image and get your result instantly. No registration, no email, and no personal information required - it's completely free and easy to use."
        }
    ];

    return (
        <div className="max-w-3xl mx-auto">
            {/* Ultra compact header */}
            <div className="flex items-center justify-center mb-8">
                <div className="h-px w-12 bg-gray-100"></div>
                <h2 className="mx-4 text-lg font-medium text-gray-900">FAQ</h2>
                <div className="h-px w-12 bg-gray-100"></div>
            </div>

            {/* Two column FAQ layout on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {faqs.map((faq, index) => (
                    <div 
                        key={index}
                        className={`bg-white border transition-all duration-200 ${
                            openIndex === index 
                                ? 'border-[#6C5CE7]/30' 
                                : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left"
                        >
                            <span className="text-sm font-medium text-gray-900 truncate pr-2">
                                {faq.question}
                            </span>
                            <span className={`ml-2 flex-shrink-0 rounded-full p-1 ${
                                openIndex === index 
                                    ? 'bg-[#6C5CE7] text-white' 
                                    : 'bg-gray-50 text-gray-400'
                            }`}>
                                <svg 
                                    className="h-3.5 w-3.5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                    style={{ 
                                        transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-200 ${
                            openIndex === index ? 'max-h-60' : 'max-h-0'
                        }`}>
                            <div className="px-4 pb-4 pt-0">
                                <div className="h-px w-full bg-gray-100 mb-3"></div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-center">
                <div className="inline-flex items-center text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1.5">
                    <span>Still have questions?</span>
                    <a href="#" className="ml-1.5 text-[#6C5CE7] font-medium">Contact us</a>
                </div>
            </div>
        </div>
    );
} 