'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Package, Search, Truck, CheckCircle2, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

export default function TrackOrderPage() {
    const { user } = useAuthStore();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
    const [email, setEmail] = useState('');
    const [fetchedOnMount, setFetchedOnMount] = useState(false);

    const mutation = useMutation({
        mutationFn: async (payload: { orderId?: string; email?: string } = {}) => {
            const id = payload.orderId || orderId;
            const mail = payload.email || email;

            if (user && !id) {
                // Fetch latest order for logged in user
                const { data: userOrders } = await api.get('/orders/myorders');
                if (userOrders && userOrders.length > 0) {
                    return userOrders[0]; 
                }
                throw new Error("No orders found in your account.");
            }

            const { data } = await api.get(`/orders/track/${id}`);

            if (!user && data.user?.email !== mail && data.shippingAddress?.email !== mail && !data.isGuest) {
                throw new Error("Email does not match the order records.");
            }

            return data;
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || err.message || "Order not found. Please check your details.");
        }
    });

    useEffect(() => {
        if (user && !fetchedOnMount) {
            mutation.mutate({});
            setFetchedOnMount(true);
        }
    }, [user, fetchedOnMount, mutation]);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        
        const isUserTrackingOwn = user && !orderId;
        
        if (!isUserTrackingOwn && (!orderId || (!user && !email))) {
            toast.error('Please enter details to track your order');
            return;
        }
        mutation.mutate({});
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const order = mutation.data;

    // Helper to determine active step
    const getStepIndex = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'pending') return 0;
        if (s === 'confirmed') return 1;
        if (['packed', 'processing'].includes(s)) return 2;
        if (s === 'shipped') return 3;
        if (s === 'out_for_delivery') return 4;
        if (s === 'delivered') return 5;
        return 0;
    };

    const currentStep = order ? getStepIndex(order.status) : 0;
    const isCancelled = order?.status?.toLowerCase() === 'cancelled';
    const isReturned = order?.status?.toLowerCase() === 'returned';

    // Mock courier & details if not populated in DB for demo purposes
    const courierPartner = order?.courierPartner || 'Delhivery';
    const trackingNumber = order?.trackingNumber || 'DLV34829382';

    return (
        <div className="bg-gray-50/50 min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/10">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Track Your Order</h1>
                    <p className="text-gray-500 max-w-lg mx-auto uppercase tracking-widest text-xs leading-relaxed">
                        Enter your order number and email or phone to search.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Order ID</label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="e.g. TF-10293"
                                className="w-full border-b-2 border-gray-200 bg-transparent px-0 py-3 text-lg focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Email or Phone Number</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email or Phone"
                                className="w-full border-b-2 border-gray-200 bg-transparent px-0 py-3 text-lg focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full md:w-auto bg-black text-white px-10 py-4 font-bold uppercase tracking-widest rounded text-sm hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                {mutation.isPending ? 'Searching...' : (
                                    <>
                                        <Search className="w-4 h-4 mr-2" /> Track Order
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Area */}
                <AnimatePresence>
                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Banners for Cancelled / Returned */}
                            {isCancelled && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center justify-between rounded-lg">
                                    <p className="text-sm font-medium text-red-800">This order has been cancelled.</p>
                                </div>
                            )}

                            {/* Section 2: Order Summary */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Order Summary</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Order ID</p>
                                        <p className="font-bold text-gray-900">#{order.order_number || order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Order Date</p>
                                        <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Status</p>
                                        <p className="font-bold text-rose-600 capitalize">{order.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Payment</p>
                                        <p className="font-bold text-gray-900">{order.isPaid ? `Paid (${order.paymentMethod?.toUpperCase()})` : 'Unpaid'}</p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">Total Amount</span>
                                    <span className="text-xl font-bold text-gray-900">₹{order.totalPrice || order.total_amount}</span>
                                </div>
                            </div>

                            {/* Section 3: Delivery Progress Timeline */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 overflow-x-auto">
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-10">Order Timeline</h3>
                                <div className="min-w-[600px] relative">
                                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full" />
                                    <div
                                        className="absolute top-5 left-0 h-1 bg-black rounded-full transition-all duration-1000"
                                        style={{ width: `${(currentStep / 5) * 100}%` }}
                                    />

                                    <div className="relative flex justify-between">
                                        {[
                                            { label: 'Order Placed', code: 'pending' },
                                            { label: 'Confirmed', code: 'confirmed' },
                                            { label: 'Packed', code: 'packed' },
                                            { label: 'Shipped', code: 'shipped' },
                                            { label: 'Out for delivery', code: 'out_for_delivery' },
                                            { label: 'Delivered', code: 'delivered' }
                                        ].map((s, idx) => {
                                            const isCompleted = idx <= currentStep && !isCancelled && !isReturned;
                                            const isActive = idx === currentStep && !isCancelled && !isReturned;
                                            const date = idx === 0 ? order.createdAt : null;

                                            return (
                                                <div key={s.label} className="flex flex-col items-center flex-1 text-center z-10">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${isCompleted ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-300'} ${isActive ? 'ring-4 ring-rose-100 shadow-md' : ''}`}>
                                                        {idx === 0 && <Package className="w-4 h-4" />}
                                                        {idx === 1 && <CheckCircle2 className="w-4 h-4" />}
                                                        {idx === 2 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                                        {idx === 3 && <Truck className="w-4 h-4" />}
                                                        {idx === 4 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>}
                                                        {idx === 5 && <CheckCircle2 className="w-5 h-5" />}
                                                    </div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mt-4 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</h4>
                                                    {date && <p className="text-[10px] text-gray-400 mt-1">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>}
                                                    {isActive && <p className="text-[10px] text-rose-600 font-bold mt-1">Current</p>}
                                                    {idx === 4 && isActive && <p className="text-[10px] text-gray-500 mt-1">Expected Today</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 & 6: Delivery Details & estimated Delivery */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Delivery Details</h3>
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Delivery Address</p>
                                            <p className="font-medium text-gray-900">{order.shippingAddress?.name}</p>
                                            <p className="text-gray-600 leading-relaxed">{order.shippingAddress?.address_line1}, {order.shippingAddress?.city}</p>
                                            <p className="text-gray-600">{order.shippingAddress?.postal_code}, {order.shippingAddress?.country}</p>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Courier Partner</p>
                                            <p className="font-bold text-gray-900">{courierPartner}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Tracking Number</p>
                                            <p className="font-bold text-gray-900 font-mono">{trackingNumber}</p>
                                        </div>
                                        <button className="w-full bg-gray-100 text-gray-800 text-center py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors mt-2">
                                            Track on Courier Website
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center text-center">
                                    <Truck className="w-12 h-12 text-rose-500 mb-4" />
                                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Estimated Delivery</p>
                                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                                        {new Date(new Date(order.createdAt).getTime() + (4 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB', { day: 'numeric' })} – {new Date(new Date(order.createdAt).getTime() + (6 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                                    </h3>
                                    <p className="text-xs text-gray-400">Timings may vary based on location or traffic.</p>
                                </div>
                            </div>

                            {/* Delivery Agent Section (Conditional) */}
                            {order.assignedDeliveryBoy && (
                                <div className="p-6 bg-rose-50 rounded-2xl flex flex-col sm:flex-row justify-between items-center border border-rose-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold font-serif text-lg">
                                            {order.assignedDeliveryBoy.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Local Executive</p>
                                            <h4 className="font-bold text-gray-900">{order.assignedDeliveryBoy.name}</h4>
                                        </div>
                                    </div>
                                    {order.assignedDeliveryBoy.phone && (
                                        <a href={`tel:${order.assignedDeliveryBoy.phone}`} className="mt-4 sm:mt-0 flex gap-2 bg-black text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg">Call Agent</a>
                                    )}
                                </div>
                            )}

                            {/* Section 5: Ordered Products */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Products Ordered</h3>
                                <div className="space-y-4">
                                    {order.orderItems?.map((item: any) => (
                                        <div key={item._id} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                            <div className="w-20 h-24 bg-gray-200 rounded overflow-hidden">
                                                <img src={item.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-gray-900">{item.title || item.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">Size: M | Qty: {item.qty || item.quantity}</p>
                                                <p className="text-sm font-bold mt-1 text-gray-900">₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 7: Help Section */}
                            <div className="text-center bg-gray-900 text-white rounded-2xl p-8">
                                <h4 className="text-lg font-serif font-bold mb-2">Need help with your order?</h4>
                                <p className="text-gray-400 text-xs mb-4">Our support team is available mon-sat 9:00am - 6:00pm</p>
                                <a href="mailto:support@timelessfinds.com" className="text-rose-400 text-sm font-bold underline">support@timelessfinds.com</a>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
