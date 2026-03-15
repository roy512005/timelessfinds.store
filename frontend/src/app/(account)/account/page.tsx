'use client';

import { useAuthStore } from '@/store/authStore';
import { Package, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function AccountDashboard() {
    const { user, token } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: orders = [] } = useQuery({
        queryKey: ['my-orders-count'],
        queryFn: async () => {
            const res = await api.get('/orders/myorders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!token && mounted,
    });

    const { data: addresses = [] } = useQuery({
        queryKey: ['user-addresses-count'],
        queryFn: async () => {
            const { data } = await api.get('/users/address', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.addresses || data || [];
        },
        enabled: !!token && mounted,
    });

    if (!mounted || !user) return null;

    // Get the most recent orders for activity feed
    const recentOrders = orders.slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Greeting */}
            <div>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-gray-900 tracking-tight">
                    Hello, {user.name.split(' ')[0]} 👋
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                    Welcome to your dashboard. Here is a quick overview of your account.
                </p>
            </div>

            {/* Quick Summary Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/account/orders" className="block p-6 rounded-sm border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors group relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-2">
                        <Package size={20} className="text-rose-500" />
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Total Orders</span>
                    </div>
                    <span className="text-3xl font-serif font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{orders.length}</span>
                    <ChevronRight size={16} className="absolute bottom-6 right-6 text-gray-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link href="/account/addresses" className="block p-6 rounded-sm border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors group relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-2">
                        <MapPin size={20} className="text-rose-500" />
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Saved Addresses</span>
                    </div>
                    <span className="text-3xl font-serif font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{addresses.length}</span>
                    <ChevronRight size={16} className="absolute bottom-6 right-6 text-gray-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Recent Activity</h3>
                {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map((order: any) => (
                            <Link
                                key={order._id}
                                href={`/track-order?orderId=${order.order_number || order._id}`}
                                className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-sm hover:border-gray-200 transition-colors group"
                            >
                                <div className="flex -space-x-2">
                                    {order.orderItems?.slice(0, 2).map((item: any, idx: number) => (
                                        <img
                                            key={idx}
                                            src={item.image}
                                            alt={item.title}
                                            className="w-10 h-10 rounded-full border-2 border-white object-cover bg-gray-100"
                                            style={{ zIndex: 2 - idx }}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {order.orderItems?.[0]?.title} {order.orderItems?.length > 1 ? `+ ${order.orderItems.length - 1} more` : ''}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()} · ₹{order.totalPrice}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-green-500' : 'bg-amber-500'}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${order.isDelivered ? 'text-green-600' : 'text-amber-600'}`}>
                                        {order.isDelivered ? 'Delivered' : 'Processing'}
                                    </span>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-rose-400 transition-colors" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-sm p-8 text-center border border-gray-100 border-dashed">
                        <Package size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-900 font-semibold mb-1">No recent orders yet</p>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                            When you place your first order or track a package, it will show up right here for easy access.
                        </p>
                        <Link
                            href="/dresses"
                            className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-rose-600 hover:text-rose-700 underline underline-offset-4"
                        >
                            Browse Collections
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
