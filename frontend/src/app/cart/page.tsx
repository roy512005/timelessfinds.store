'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function CartPage() {
    const { items, removeItemLocally, updateQuantityLocally, fetchCart, hydrated: isStoreHydrated } = useCartStore();
    const { user } = useAuthStore();
    const [reservationTime, setReservationTime] = useState(10 * 60);
    const { settings, fetchSettings } = useSettingsStore();

    useEffect(() => {
        if (!settings) fetchSettings();
    }, [settings, fetchSettings]);

    // Fetch remote cart once on mount if authenticated
    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]);

    useEffect(() => {
        if (items.length > 0) {
            const timer = setInterval(() => {
                setReservationTime(prev => prev > 0 ? prev - 1 : 0);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [items.length]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const originalTotal = items.reduce((acc, item) => acc + (Number(item.originalPrice) || Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const totalSavings = originalTotal - subtotal;

    const freeShippingThreshold = settings?.freeShippingThreshold || 999;
    const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    const amountToFreeShipping = freeShippingThreshold - subtotal;

    if (!isStoreHydrated) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] px-4 text-center">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 text-sm uppercase tracking-widest font-medium">Loading your bag…</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] px-4 text-center bg-[#fafaf9]">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-gray-100">
                    <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">Your bag is empty</h2>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto text-sm leading-relaxed">
                    Discover our exclusive collections — handcrafted sarees, kurtis, lehengas and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/dresses" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors">
                        Shop Women
                    </Link>
                    <Link href="/dresses?gender=Men" className="border border-black text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                        Shop Men
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">Your Bag ({items.length})</h1>

            {/* Cart Reservation Banner */}
            <AnimatePresence>
                {reservationTime > 0 && items.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm"
                    >
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                            <svg className="w-6 h-6 text-yellow-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm font-bold text-yellow-900">High demand items in your bag!</p>
                                <p className="text-xs text-yellow-700">We&apos;ve reserved your items to guarantee availability.</p>
                            </div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-yellow-200">
                            <span className="text-xs text-gray-500 mr-2 uppercase tracking-wide font-bold">Reserved For:</span>
                            <span className="font-mono text-lg font-bold text-red-600 tracking-wider">
                                {formatTime(reservationTime)}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    {/* Free Shipping Progress */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="font-bold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                {amountToFreeShipping > 0 ? 'Almost there!' : 'You unlocked Free Premium Shipping!'}
                            </h3>
                            {amountToFreeShipping > 0 && (
                                <span className="text-sm font-medium text-rose-600">
                                    Add ₹{amountToFreeShipping.toLocaleString()} for Free Shipping
                                </span>
                            )}
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToFreeShipping}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full rounded-full ${progressToFreeShipping === 100 ? 'bg-green-500' : 'bg-rose-600'}`}
                            />
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-6">
                        {items.map((item) => (
                            <div key={`${item._id}-${item.size}`} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-bl-lg">
                                    Selling Fast
                                </div>

                                <div className="w-full sm:w-32 h-40 bg-gray-100 flex-shrink-0 rounded-lg relative overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">👗</div>
                                    )}
                                </div>

                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start mb-1 mt-2">
                                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                        <button onClick={() => removeItemLocally(item._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {item.size && <p className="text-gray-500 text-sm mb-4">Size: <span className="font-medium text-gray-900">{item.size}</span></p>}

                                    <div className="flex justify-between items-center mt-auto">
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            <button onClick={() => { if ((item.quantity || 1) > 1) updateQuantityLocally(item._id, (item.quantity || 1) - 1); }} className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-md" disabled={(item.quantity || 1) <= 1}>-</button>
                                            <span className="px-3 py-1 font-medium text-sm">{item.quantity || 1}</span>
                                            <button onClick={() => updateQuantityLocally(item._id, (item.quantity || 1) + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-md">+</button>
                                        </div>

                                        <div className="text-right">
                                            {(item.originalPrice || 0) > (item.price || 0) && (
                                                <div className="text-xs text-gray-400 line-through mb-0.5">₹{((item.originalPrice || 0) * (item.quantity || 1)).toLocaleString()}</div>
                                            )}
                                            <div className="text-lg font-bold text-gray-900">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 text-sm mb-6 border-b border-gray-200 pb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{originalTotal.toLocaleString()}</span>
                            </div>
                            {totalSavings > 0 && (
                                <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>Discount Applied</span>
                                    <span>-₹{totalSavings.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{amountToFreeShipping > 0 ? 'Calculated at checkout' : <span className="text-green-600 font-bold uppercase tracking-wider text-xs">Free</span>}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
                                {totalSavings > 0 && (
                                    <p className="text-emerald-600 text-xs font-bold mt-1 bg-emerald-100 inline-block px-2 py-0.5 rounded">You save ₹{totalSavings.toLocaleString()}!</p>
                                )}
                            </div>
                        </div>

                        <Link href={user ? '/checkout' : '/login?redirect=/checkout'}>
                            <Button size="lg" className="w-full text-lg h-14 bg-black hover:bg-gray-800 shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1">
                                Checkout Securely ➔
                            </Button>
                        </Link>

                        <div className="mt-6">
                            <p className="text-xs text-center text-gray-500 mb-3 uppercase tracking-wider font-bold">Guaranteed Safe Checkout</p>
                            <div className="flex justify-center flex-wrap gap-2 text-gray-400">
                                <div className="px-2 py-1 border border-gray-200 rounded text-[10px] font-bold uppercase">Stripe</div>
                                <div className="px-2 py-1 border border-gray-200 rounded text-[10px] font-bold uppercase">Razorpay</div>
                                <div className="px-2 py-1 border border-gray-200 rounded text-[10px] font-bold uppercase">G Pay</div>
                                <div className="px-2 py-1 border border-gray-200 rounded text-[10px] font-bold uppercase">256-Bit SSL</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
