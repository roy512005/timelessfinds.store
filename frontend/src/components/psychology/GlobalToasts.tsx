'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function GlobalPsychologyToasts() {
    const [toast, setToast] = useState<{ id: string, title: string, message: string, type: 'urgent' | 'reward' | 'trend' } | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // 23. Sale ending notifications (Toast/Alert)
        // 24. Limited hour deals ("Lunchbreak Special")
        // 28. Weekend-only offers
        // 29. Event-based discounts
        // 62. Surprise coupons mid-scroll
        // 69. Random reward notifications
        // 74. Personalized notifications
        // 79. Fashion trend alerts
        // 84. Personalized discount popups

        const triggers = [
            { type: 'urgent', title: 'Flash Deal Ending!', message: 'The 15% VIP discount expires in 5 minutes.', delay: 15000 },
            { type: 'reward', title: 'Mid-Scroll Surprise 🎁', message: 'You unlocked a secret 5% stacked coupon! Code: AURA5', delay: 35000 },
            { type: 'trend', title: 'Trend Alert 📈', message: 'Velvet Gowns are currently trending in your city (Mumbai).', delay: 45000 },
            { type: 'urgent', title: 'Lunchbreak Special 🥪', message: 'Free express shipping on all orders placed before 2 PM.', delay: 60000 },
            { type: 'reward', title: 'Loyalty Bonus 💎', message: 'You earned 50 extra Aura points for browsing the new collection!', delay: 80000 },
            { type: 'trend', title: 'Weekend Exclusive 🎉', message: 'The Weekend Vault is open. 20% off all cocktail dresses.', delay: 100000 },
        ];

        const timeoutsRef: NodeJS.Timeout[] = [];

        // Trigger sequential toasts
        triggers.forEach((trigger) => {
            const timeout = setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setToast({ id: Math.random().toString(), ...trigger as any });

                // Auto-dismiss after 6 seconds
                setTimeout(() => setToast(null), 6000);
            }, trigger.delay);
            timeoutsRef.push(timeout);
        });

        return () => {
            timeoutsRef.forEach(clearTimeout);
        };
    }, [pathname]);

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    className={`fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 w-80 p-4 rounded-xl shadow-2xl border ${toast.type === 'urgent' ? 'bg-black text-white border-red-500' :
                        toast.type === 'reward' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400' :
                            'bg-white text-black border-rose-200'
                        }`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center space-x-2">
                            {toast.type === 'urgent' && <span className="animate-pulse">🔥</span>}
                            {toast.type === 'reward' && <span className="animate-bounce">🎁</span>}
                            {toast.type === 'trend' && <span>✨</span>}
                            <strong className={`font-bold text-sm tracking-wide ${toast.type === 'trend' ? 'text-rose-600' : 'text-white'}`}>
                                {toast.title}
                            </strong>
                        </div>
                        <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>
                    <p className={`text-xs mt-2 ${toast.type === 'trend' ? 'text-gray-600' : 'text-gray-200'}`}>
                        {toast.message}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
