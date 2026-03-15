'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export function ScratchCard() {
    const [scratched, setScratched] = useState(false);
    const { width, height } = useWindowSize();

    return (
        <section className="bg-black py-20 px-4 relative overflow-hidden border-t-8 border-rose-600">
            {scratched && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} colors={['#FFD700', '#f43f5e', '#fff']} />}

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="text-rose-500 font-bold tracking-widest text-xs uppercase mb-4 block animate-bounce">Interactive Reward (Lucky Draw)</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">The Secret Vault</h2>
                <p className="text-gray-400 mb-10 max-w-lg mx-auto">Only 1 in 50 visitors see this section. Tap to scratch the card and reveal your personal mystery discount.</p>

                <AnimatePresence mode="wait">
                    {!scratched ? (
                        <motion.button
                            key="unscratched"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setScratched(true)}
                            className="w-full max-w-md mx-auto aspect-[3/1] bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-xl border-4 border-gray-600 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden group cursor-pointer"
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            <span className="text-gray-300 font-bold uppercase tracking-widest z-10 text-lg">Tap to Scratch</span>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="scratched"
                            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            className="w-full max-w-md mx-auto aspect-[3/1] bg-gradient-to-r from-rose-500 to-rose-700 rounded-xl border-4 border-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.4)] flex flex-col items-center justify-center"
                        >
                            <span className="text-white font-bold uppercase tracking-widest text-sm mb-1">You Unlocked</span>
                            <span className="text-white font-black text-4xl">20% OFF</span>
                            <span className="text-rose-200 text-xs mt-2 bg-black/30 px-3 py-1 rounded-full">Code: VAULT20</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
        </section>
    );
}
