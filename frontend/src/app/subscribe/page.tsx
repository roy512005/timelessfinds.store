'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscribePage() {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitting(false);
            setSubscribed(true);
            toast.success("Welcome to the inner circle.");
        }, 1200);
    };

    return (
        <div className="bg-gray-50/50 min-h-screen pt-32 pb-16 flex items-center justify-center">
            <div className="max-w-xl mx-auto px-6 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-14 text-center overflow-hidden relative"
                >
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-gray-100 rounded-full blur-3xl opacity-50" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                            <Mail className="w-6 h-6 text-gray-900" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Join The List</h1>
                        <p className="text-gray-500 mb-10 text-sm leading-relaxed max-w-sm mx-auto">
                            Subscribe for early access to new collections, secret sales, and exclusive event invitations.
                        </p>

                        {!subscribed ? (
                            <form onSubmit={handleSubmit} className="relative max-w-sm mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black pr-16 transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="absolute right-2 top-2 bottom-2 bg-black text-white rounded-full w-10 flex items-center justify-center hover:bg-rose-600 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-4 h-4" />
                                    )}
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-100"
                            >
                                <h3 className="font-bold mb-2 uppercase tracking-widest text-sm text-green-900">Subscription Confirmed</h3>
                                <p className="text-sm">Thank you for subscribing. Check your inbox to confirm your membership.</p>
                            </motion.div>
                        )}

                        <div className="mt-8 text-xs text-gray-400">
                            By subscribing, you agree to our <a href="/terms" className="underline hover:text-gray-900">Terms of Service</a> and <a href="/privacy-policy" className="underline hover:text-gray-900">Privacy Policy</a>.
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
