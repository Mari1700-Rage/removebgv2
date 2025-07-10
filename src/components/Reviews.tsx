import Image from 'next/image';
import { useState } from 'react';

type Review = {
    name: string;
    role: string;
    company: string;
    text: string;
    image: string;
};

export default function Reviews() {
    const reviews: Review[] = [
        {
            name: "Shelly Kim",
            role: "Owner",
            company: "Letters by Shells",
            text: "I enjoy using the remove background feature during my product launches! In just a few steps, I'm able to quickly remove the original background and add a fun one with my product.",
            image: "/reviewer1.webp"
        },
        {
            name: "Abs Ahlijah",
            role: "Marketing",
            company: "Soul Session",
            text: "As a marketer who is always on the move, this tool helps me to create fast, high quality content. Absolute endless features to enhance my creativity!",
            image: "/reviewer2.webp"
        },
        {
            name: "Penuel Stanley-Zebulon",
            role: "Student",
            company: "PSU",
            text: "The remove background image tool saved me hours of tedious editing, effortlessly removing backgrounds and refining my images with just a few clicks.",
            image: "/reviewer3.webp"
        }
    ];

    return (
        <section className="py-10">
            {/* Ultra minimal header */}
            <div className="text-center mb-6">
                <span className="inline-block text-xs uppercase tracking-wider text-gray-400 font-medium mb-1">
                    Testimonials
                </span>
                <h2 className="text-xl font-medium text-gray-900">
                    Users love our tool
                </h2>
            </div>
            
            {/* Single row of cards */}
            <div className="flex overflow-x-auto custom-scrollbar pb-6 gap-4 px-4 max-w-5xl mx-auto">
                {reviews.map((review, index) => (
                    <div 
                        key={index}
                        className="flex-none w-[280px] bg-white border border-gray-100 p-4 rounded"
                    >
                        {/* Stars at top */}
                        <div className="flex mb-3">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                </svg>
                            ))}
                        </div>
                        
                        {/* Testimonial text */}
                        <p className="text-xs leading-relaxed text-gray-700 mb-4 h-20 overflow-hidden">
                            "{review.text}"
                        </p>
                        
                        {/* User info */}
                        <div className="flex items-center">
                            <div className="relative w-8 h-8 mr-3">
                                <Image
                                    src={review.image}
                                    alt={review.name}
                                    fill
                                    className="object-cover rounded-full"
                                />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-900">{review.name}</p>
                                <p className="text-[10px] text-gray-500">{review.role} @ {review.company}</p>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* "View all" card */}
                <div className="flex-none w-[160px] flex flex-col items-center justify-center bg-gradient-to-r from-[#6C5CE7]/5 to-[#FF7170]/5 border border-gray-100 p-4 rounded">
                    <div className="bg-white rounded-full shadow-sm w-8 h-8 flex items-center justify-center mb-2">
                        <svg className="w-4 h-4 text-[#6C5CE7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <p className="text-xs font-medium text-[#6C5CE7]">Read more</p>
                    <p className="text-[10px] text-gray-500 text-center mt-1">
                        From 10,000+ happy users
                    </p>
                </div>
            </div>
            
            {/* Bottom metric */}
            <div className="flex justify-center mt-4">
                <div className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-medium">4.9/5</span>
                    <span className="mx-1.5">·</span>
                    <span>Based on 10,000+ reviews</span>
                </div>
            </div>
        </section>
    );
}

<style jsx global>{`
  .custom-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }
`}</style> 