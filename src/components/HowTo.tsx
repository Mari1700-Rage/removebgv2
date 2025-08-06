import { motion } from 'framer-motion';

type HowToProps = {
    variant?: 'home' | 'images' | 'dark' | 'light';
};

export default function HowTo({ variant = 'images' }: HowToProps) {
    const steps = [
        {
            title: "Upload your image",
            description: "Once uploaded, the tool will automatically remove the background. This may take a few seconds, depending on the file size."
        },
        {
            title: "Optionally, add a new background",
            description: "Choose solid-color or photo backgrounds from our gallery or any image of yours to use as a new background for your picture."
        },
        {
            title: "Download the final image",
            description: "Once you're happy with the result, save it."
        }
    ];

    const isDark = variant === 'dark';
    const isLight = variant === 'light';

    return (
        <div className={`max-w-3xl mx-auto px-4 ${isLight ? 'bg-white rounded-lg shadow-sm' : ''}`}>
            {/* Header - Extremely minimal */}
            <div className={`border-b ${isDark ? 'border-gray-700' : isLight ? 'border-gray-200' : 'border-gray-100'} pb-3 mb-5`}>
                {variant === 'home' ? (
                    <h2 className={`text-lg font-medium ${isDark ? 'text-gray-200' : isLight ? 'text-gray-800' : 'text-gray-800'}`}>
                        Three simple steps — <span className={isDark ? "text-purple-400" : isLight ? "text-blue-600" : "text-[#6C5CE7]"}>It&apos;s that easy.</span>
                    </h2>
                ) : (
                    <h2 className={`text-lg font-medium ${isDark ? 'text-gray-200' : isLight ? 'text-gray-800' : 'text-gray-800'}`}>
                        How to remove backgrounds
                    </h2>
                )}
            </div>

            {/* Ultra minimal step list */}
            <div className="space-y-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 }}
                    >
                        <div className="flex">
                            {/* Step number */}
                            <div className="mr-4 flex-shrink-0">
                                <span className={`inline-block ${
                                    isDark 
                                        ? 'text-purple-400 border-purple-500/20' 
                                        : isLight 
                                            ? 'text-blue-600 border-blue-200 bg-blue-50' 
                                            : 'text-[#6C5CE7] border-[#6C5CE7]/20'
                                } font-mono text-xs px-2 py-1 border rounded`}>
                                    {index + 1}
                                </span>
                            </div>
                            
                            {/* Content */}
                            <div>
                                <h3 className={`font-medium mb-1 ${
                                    isDark 
                                        ? 'text-gray-200' 
                                        : isLight 
                                            ? 'text-gray-900' 
                                            : 'text-gray-900'
                                }`}>{step.title}</h3>
                                <p className={`text-sm ${
                                    isDark 
                                        ? 'text-gray-400' 
                                        : isLight 
                                            ? 'text-gray-600' 
                                            : 'text-gray-500'
                                }`}>{step.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Ultra minimal footer action */}
            {variant === 'home' && (
                <div className={`mt-10 pt-4 border-t ${
                    isDark 
                        ? 'border-gray-700' 
                        : isLight 
                            ? 'border-gray-200' 
                            : 'border-gray-100'
                } text-center`}>
                    <a 
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`text-sm ${
                            isDark 
                                ? 'text-purple-400' 
                                : isLight 
                                    ? 'text-blue-600' 
                                    : 'text-[#6C5CE7]'
                        } hover:underline`}
                    >
                        Start now →
                    </a>
                </div>
            )}
        </div>
    );
} 