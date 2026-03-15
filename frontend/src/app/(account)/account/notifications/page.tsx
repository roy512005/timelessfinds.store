'use client';

import { BellRing, PackageCheck, Heart, Megaphone } from 'lucide-react';

const NOTIFICATIONS = [
    { id: 1, type: 'order', icon: PackageCheck, color: 'text-green-500', bg: 'bg-green-50', text: 'Your order #ORD49281 has been shipped! Delivery expected on 12 March.', time: '2 hours ago', unread: true },
    { id: 2, type: 'promo', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50', text: 'Exclusive Early Access! The new Summer Collection drops tomorrow. Shop first.', time: '1 day ago', unread: true },
    { id: 3, type: 'wishlist', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', text: 'Good news! The Aurora Tulle Ballgown from your wishlist is back in stock.', time: '3 days ago', unread: false },
    { id: 4, type: 'order', icon: PackageCheck, color: 'text-green-500', bg: 'bg-green-50', text: 'Your order #ORD11032 was successfully delivered. We hope you love your dress!', time: '1 week ago', unread: false },
];

export default function NotificationsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-black text-gray-900 tracking-tight">
                        Notifications
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Stay updated on your orders and exclusive offers.
                    </p>
                </div>
                <button className="text-xs font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {NOTIFICATIONS.map((note) => {
                    const Icon = note.icon;
                    return (
                        <div
                            key={note.id}
                            className={`p-5 flex gap-5 rounded-sm border transition-colors ${note.unread
                                    ? 'bg-rose-50/20 border-rose-100'
                                    : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex shrink-0 items-center justify-center ${note.bg} ${note.color}`}>
                                <Icon size={20} />
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm leading-relaxed ${note.unread ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                    {note.text}
                                </p>
                                <span className="block mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {note.time}
                                </span>
                            </div>
                            {note.unread && (
                                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-2 shrink-0 shadow-sm" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="pt-8 flex justify-center border-t border-gray-100">
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                    <BellRing size={14} /> View Notification Settings
                </button>
            </div>
        </div>
    );
}
