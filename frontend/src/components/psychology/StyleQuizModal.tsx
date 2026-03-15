'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export const StyleQuizModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Show after 3 seconds of curiosity
        const timer = setTimeout(() => {
            const hasTakenQuiz = localStorage.getItem('style_quiz_taken');
            if (!hasTakenQuiz) {
                setIsOpen(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const completeQuiz = () => {
        localStorage.setItem('style_quiz_taken', 'true');
        setStep(3);
        setTimeout(() => setIsOpen(false), 3000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {step === 0 && (
                            <div className="text-center">
                                <span className="text-rose-600 font-bold tracking-wider text-xs uppercase mb-2 block">Personalize Your Experience</span>
                                <h2 className="text-2xl font-serif font-bold mb-4">Discover Your Aura</h2>
                                <p className="text-gray-600 mb-6">Take a 2-question quiz to let us curate the perfect dresses for your style.</p>
                                <div className="flex justify-center space-x-3">
                                    <Button onClick={() => setStep(1)} className="w-full">Start Quiz</Button>
                                </div>
                                <p className="text-xs text-gray-400 mt-4 underline cursor-pointer" onClick={() => setIsOpen(false)}>I&apos;ll browse everything first</p>
                            </div>
                        )}

                        {step === 1 && (
                            <div>
                                <h2 className="text-xl font-bold mb-6 text-center">What is your primary style?</h2>
                                <div className="space-y-3">
                                    {['Minimalist & Elegant', 'Bold & Vibrant', 'Romantic & Lace', 'Classic Vintage'].map((style) => (
                                        <motion.button
                                            key={style}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setStep(2)}
                                            className="w-full py-3 px-4 border text-left rounded-lg hover:border-black hover:bg-gray-50 transition-colors"
                                        >
                                            {style}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h2 className="text-xl font-bold mb-6 text-center">Which colors do you wear most?</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Neutrals (Black, White)', 'Earth Tones', 'Jewel Tones', 'Pastels'].map((color) => (
                                        <motion.button
                                            key={color}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={completeQuiz}
                                            className="py-3 px-4 border text-center rounded-lg hover:border-black hover:bg-gray-50 transition-colors"
                                        >
                                            {color}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold mb-2">Style Profile Saved!</h2>
                                <p className="text-green-600 font-medium mb-4 animate-pulse">🎁 +150 Aura Points added!</p>
                                <p className="text-gray-600 text-sm">We are personalizing your homepage now...</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
