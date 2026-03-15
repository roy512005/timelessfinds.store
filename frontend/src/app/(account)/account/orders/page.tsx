'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import { PackageOpen, ExternalLink, CalendarDays, ChevronDown, ChevronUp, MapPin, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

export default function MyOrdersPage() {
    const { token } = useAuthStore();
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const { data: orders, isLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: async () => {
            const res = await api.get('/orders/myorders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!token,
    });

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-gray-100 w-1/3 mb-8 rounded"></div>
                {[1, 2, 3].map((n) => (
                    <div key={n} className="h-40 bg-gray-50 border border-gray-100 rounded"></div>
                ))}
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <PackageOpen size={32} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">No Orders Found</h2>
                <p className="text-gray-500 max-w-sm mb-8">
                    Looks like you haven't made any purchases yet. Your timeless pieces are waiting for you.
                </p>
                <Link
                    href="/dresses"
                    className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-gray-900 tracking-tight">
                    Order History
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                    Review your past purchases and track ongoing deliveries.
                </p>
            </div>

            <div className="space-y-6">
                {orders.map((order: any) => (
                    <div key={order._id} className="border border-gray-100 bg-white rounded-md overflow-hidden hover:shadow-sm transition-shadow">
                        {/* Order Header */}
                        <div className="bg-gray-50 border-b border-gray-100 p-4 sm:p-6 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-8 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1 text-xs uppercase tracking-widest font-bold">Order Placed</p>
                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                        <CalendarDays size={14} className="text-gray-400" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1 text-xs uppercase tracking-widest font-bold">Total</p>
                                    <p className="font-medium text-gray-900">₹{order.totalPrice}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1 text-xs uppercase tracking-widest font-bold">Order ID</p>
                                    <p className="font-medium text-gray-900">{order.order_number || order._id}</p>
                                </div>
                            </div>

                            <Link
                                href={`/track-order?orderId=${order.order_number || order._id}`}
                                className="text-xs uppercase tracking-widest font-bold text-rose-600 hover:text-rose-700 flex items-center gap-2 bg-rose-50 px-4 py-2 border border-rose-100 transition-colors"
                            >
                                Track & View Details
                                <ExternalLink size={14} />
                            </Link>
                        </div>

                        {/* Order Items Summary */}
                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-4 pl-4 overflow-hidden">
                                    {order.orderItems.map((item: any, idx: number) => (
                                        <img
                                            key={item._id || idx}
                                            src={item.image}
                                            alt={item.title}
                                            className="w-16 h-16 rounded-full border-2 border-white object-cover bg-gray-100 hover:-translate-y-2 transition-transform duration-300 relative shadow-sm"
                                            style={{ zIndex: order.orderItems.length - idx }}
                                        />
                                    ))}
                                </div>
                                <div className="ml-2">
                                    <h4 className="font-serif font-semibold text-base text-gray-900 mb-0.5">
                                        {order.orderItems[0].title}
                                    </h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                        {order.orderItems.length} {order.orderItems.length === 1 ? 'Item' : 'Items'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="text-left sm:text-right flex-1">
                                    <div className="inline-flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                        <span className={`text-sm font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'text-green-600' : order.status === 'cancelled' ? 'text-red-600' : 'text-amber-600'}`}>
                                            {order.status || 'Processing'}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                                >
                                    {expandedOrder === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedOrder === order._id && (
                            <div className="px-4 pb-6 sm:px-8 sm:pb-8 border-t border-gray-50 animate-in slide-in-from-top-4 duration-300">
                                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Shipping Info */}
                                    <div className="space-y-4">
                                        <h5 className="text-xs uppercase tracking-[0.2em] font-black text-gray-400 flex items-center gap-2">
                                            <MapPin size={12} /> Shipping Address
                                        </h5>
                                        <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                            <p className="font-bold text-gray-900 mb-1">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                                            <p>{order.shippingAddress?.address}</p>
                                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                                            <p className="mt-2 text-xs text-gray-500 italic">📞 {order.shippingAddress?.phone}</p>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="space-y-4">
                                        <h5 className="text-xs uppercase tracking-[0.2em] font-black text-gray-400 flex items-center gap-2">
                                            <CreditCard size={12} /> Order Summary
                                        </h5>
                                        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Items Total</span>
                                                <span className="font-medium">₹{order.itemsPrice || order.totalPrice - (order.shippingPrice || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Shipping</span>
                                                <span className="font-medium text-green-600">{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
                                            </div>
                                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                                <span className="font-bold text-gray-900">Paid Total</span>
                                                <span className="font-bold text-gray-900 underline decoration-rose-200 decoration-4 underline-offset-2">₹{order.totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="mt-8">
                                    <h5 className="text-xs uppercase tracking-[0.2em] font-black text-gray-400 mb-4 px-2">Order Items</h5>
                                    <div className="divide-y divide-gray-50">
                                        {order.orderItems.map((item: any, idx: number) => (
                                            <div key={item._id || idx} className="py-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <img src={item.image} className="w-12 h-12 rounded object-cover" alt={item.title} />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity} · Size: {item.size || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
