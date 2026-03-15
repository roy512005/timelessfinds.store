'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationInbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = 3;

    const notifications = [
        { id: 1, title: '⚡ Your Cart is Waiting', desc: 'The Midnight Silk Slip might sell out soon!', time: '10m ago', unread: true },
        { id: 2, title: '🎁 Surprise Unlocked', desc: 'You have a mystery 15% discount for the next 2 hours.', time: '1h ago', unread: true },
        { id: 3, title: '🔥 Trending in Kolkata', desc: 'Aura Velvet Gown was just bought by 12 fashionistas.', time: '3h ago', unread: true },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-800 hover:text-rose-600 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 rounded-full h-3 w-3 animate-ping" />
                )}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 border border-white rounded-full h-3 w-3" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                            <span className="text-xs text-rose-600 font-medium cursor-pointer">Mark all as read</span>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map((n) => (
                                <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${n.unread ? 'bg-rose-50/30' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm ${n.unread ? 'font-bold text-black' : 'font-medium text-gray-800'}`}>{n.title}</h4>
                                        <span className="text-xs text-gray-400 shrink-0">{n.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-snug tracking-tight">{n.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
