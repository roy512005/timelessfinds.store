'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Package, Navigation, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryOrderDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [note, setNote] = useState('');

    const fetchOrder = async () => {
        const token = localStorage.getItem('delivery-token');
        if (!token) return router.push('/delivery');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
            const res = await fetch(`${apiUrl}/delivery/orders/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setOrder(data);
        } catch (err) {
            toast.error('Order not found or assigned to someone else.');
            router.push('/delivery/dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (status: string) => {
        if (status === 'Failed' && !note.trim()) {
            return toast.error('Please enter a reason for failed delivery in the notes.');
        }

        const token = localStorage.getItem('delivery-token');
        setUpdating(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
            const res = await fetch(`${apiUrl}/delivery/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, note })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success(`Order marked as ${status}`);
            if (status === 'Delivered') {
                router.push('/delivery/completed');
            } else {
                fetchOrder();
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setUpdating(false);
            setNote('');
        }
    };

    if (loading) return <div className="p-4"><div className="h-64 bg-gray-100 rounded-xl animate-pulse" /></div>;
    if (!order) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-900 leading-tight">Order #{order.order_number || order._id.slice(-6).toUpperCase()}</h1>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded mt-1 inline-block">
                            {order.deliveryStatus || 'Assigned'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4 max-w-2xl mx-auto pb-40">
                {/* Customer Details */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                        <UserIcon /> Customer
                    </h2>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg text-gray-900">{order.user?.name || 'Guest User'}</p>
                            <p className="text-sm font-medium text-gray-500">{order.user?.phone}</p>
                        </div>
                        <a href={`tel:${order.user?.phone}`} className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-rose-600 transition-transform hover:scale-105">
                            <Phone size={20} fill="currentColor" />
                        </a>
                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Delivery Address</p>
                                <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                    {order.shippingAddress?.line1}<br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                                </p>
                            </div>
                        </div>
                        <a
                            href={`https://maps.google.com/?q=${order.shippingAddress?.line1},${order.shippingAddress?.city},${order.shippingAddress?.pincode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 w-full bg-gray-50 text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                            <Navigation size={14} /> Open in Maps
                        </a>
                    </div>
                </div>

                {/* Amount to Collect */}
                <div className={`rounded-2xl p-5 shadow-sm border ${order.isPaid ? 'bg-green-50 border-green-100' : 'bg-rose-50 border-rose-100'}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className={`text-xs font-bold uppercase tracking-widest ${order.isPaid ? 'text-green-600' : 'text-rose-600'} mb-1`}>
                                Amount to Collect
                            </p>
                            <p className={`font-black text-3xl ${order.isPaid ? 'text-green-700' : 'text-rose-700'}`}>
                                {order.isPaid ? 'PAID' : `₹${order.totalPrice}`}
                            </p>
                        </div>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                            {order.isPaid ? <CheckCircle size={28} /> : <span className="font-serif font-black text-2xl">₹</span>}
                        </div>
                    </div>
                    {!order.isPaid && <p className="text-xs text-rose-600/70 mt-3 font-medium">Please collect exact cash or use personal QR. Update status only after payment is received.</p>}
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                        <Package size={16} /> Package Contents ({order.orderItems?.length} items)
                    </h2>
                    <div className="space-y-3">
                        {order.orderItems?.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center p-3 bg-gray-50 rounded-xl">
                                <img src={item.image} alt="product" className="w-12 h-12 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.title || item.product?.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions Floating Bar */}
            <div className="fixed bottom-0 md:bottom-auto inset-x-0 md:static md:mt-8 bg-white border-t border-gray-200 p-4 pb-8 md:pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Add delivery note (Required for Failed status)"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:outline-none focus:bg-white text-sm mb-4"
                    />
                    <div className="flex gap-3">
                        {order.deliveryStatus !== 'Out for Delivery' && (
                            <button
                                disabled={updating}
                                onClick={() => handleStatusUpdate('Out for Delivery')}
                                className="flex-1 bg-black text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-transform active:scale-95 disabled:opacity-50"
                            >
                                Start Delivery
                            </button>
                        )}
                        {order.deliveryStatus === 'Out for Delivery' && (
                            <>
                                <button
                                    disabled={updating}
                                    onClick={() => handleStatusUpdate('Delivered')}
                                    className="flex-[2] bg-green-500 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:bg-green-600 transition-transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {updating ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle size={18} /> Mark Delivered</>}
                                </button>
                                <button
                                    disabled={updating}
                                    onClick={() => handleStatusUpdate('Failed')}
                                    className="flex-1 bg-rose-50 text-rose-600 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-rose-100 transition-transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 border border-rose-200"
                                >
                                    {updating ? <Loader2 size={18} className="animate-spin" /> : <><XCircle size={18} /> Failed</>}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
