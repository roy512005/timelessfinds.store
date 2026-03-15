'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export const ExitIntentPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Only show once when the user opens the page for the first time
        const hasShown = localStorage.getItem('dressAuraWelcomeShown');

        if (!hasShown) {
            // Slight delay so it doesn't pop identically with the page render
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSelection = (preference: string | null) => {
        localStorage.setItem('dressAuraWelcomeShown', 'true');
        if (preference) {
            localStorage.setItem('dressAuraPreference', preference);
        }
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="bg-white rounded-none w-full max-w-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative flex flex-col md:flex-row items-stretch"
                    >
                        {/* Luxury Image Left Side */}
                        <div className="hidden md:block w-1/2 relative bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"
                                alt="Welcome"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>

                        {/* Content Right Side */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-gray-900 mb-3 tracking-tight">DressAura</h2>
                            <p className="text-sm text-gray-500 mb-10 tracking-wide">Select your shopping preference to personalize your experience.</p>

                            <div className="flex flex-col gap-4 w-full mb-8">
                                <button
                                    onClick={() => handleSelection('Women')}
                                    className="w-full bg-black text-white hover:bg-rose-600 transition-colors text-xs font-bold uppercase tracking-widest py-4 rounded-sm"
                                >
                                    Women
                                </button>
                                <button
                                    onClick={() => handleSelection('Men')}
                                    className="w-full bg-white text-black border border-gray-200 hover:border-black transition-colors text-xs font-bold uppercase tracking-widest py-4 rounded-sm"
                                >
                                    Men
                                </button>
                                <button
                                    onClick={() => handleSelection('Kids')}
                                    className="w-full bg-white text-black border border-gray-200 hover:border-black transition-colors text-xs font-bold uppercase tracking-widest py-4 rounded-sm"
                                >
                                    Kids / Baby
                                </button>
                            </div>

                            <button
                                onClick={() => handleSelection(null)}
                                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 underline underline-offset-4 transition-colors"
                            >
                                Skip for now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
