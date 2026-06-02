"use client";

import React, { useState, useEffect } from 'react';

interface HeroProps {
    // Dynamic banner image handle korar array (Default vabe 1ta thakbe)
    banners?: string[];
}

const Hero: React.FC<HeroProps> = ({ 
    banners = ["/banner/banner5.png"] 
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const isSliderEnabled = banners.length > 1;

    // Multiple image thakle auto-play sliding mechanism build kora hoyeche
    useEffect(() => {
        if (!isSliderEnabled) return;

        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000); // Protite slide 5 second por por change hobe

        return () => clearInterval(slideInterval);
    }, [isSliderEnabled, banners.length]);

    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            <div className='w-full'>
                {/* 
                  Apnar custom design layout onujayi absolute height container:
                  Desktop high-end devices-e exact h-[570px] thakbe, 
                  ebong mobile screens-e automatic standard layout balance korbe.
                */}
                <div className='w-full h-[320px] sm:h-[450px] md:h-[520px] lg:h-[570px] rounded-2xl overflow-hidden relative group shadow-sm bg-white'>
                    
                    {/* Banners Renderer Map */}
                    {banners.map((image, index) => (
                        <div 
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out ${
                                index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
                            }`}
                            style={{ backgroundImage: `url("${image}")` }}
                        >
                            {/* Professional Touch: Elegant Soft Overlay */}
                            <div className='absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none'></div>
                        </div>
                    ))}

                    {/* Conditional Rendering: Multiple image thaklei shudhu dynamic dots asbe */}
                    {isSliderEnabled && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                            {banners.map((_, index) => (
                                <button 
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer outline-none border-none ${
                                        index === currentSlide 
                                            ? "w-10 bg-[var(--color-primary)]" 
                                            : "w-3 bg-white/60 hover:bg-white"
                                    }`}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero;