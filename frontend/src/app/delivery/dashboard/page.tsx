'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PackageSearch, MapPin, Navigation, Phone, Clock } from 'lucide-react';

export default function DeliveryDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('delivery-token');
            if (!token) return router.push('/delivery');

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
                const res = await fetch(`${apiUrl}/delivery/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Unauth');
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                localStorage.removeItem('delivery-token');
                router.push('/delivery');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-4"><div className="h-32 bg-gray-100 rounded-xl animate-pulse" /></div>;

    const activeOrders = orders.filter(o => !['Delivered', 'Failed'].includes(o.deliveryStatus));

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-serif font-black text-gray-900 mb-1 tracking-tight">Assigned Deliveries</h1>
            <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-200">
                You have {activeOrders.length} active orders to deliver today.
            </p>

            {activeOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                    <PackageSearch size={40} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No active deliveries</h3>
                    <p className="text-gray-500 text-sm mt-1">Take a break or check back later.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activeOrders.map(order => (
                        <Link
                            href={`/delivery/order/${order._id}`}
                            key={order._id}
                            className="block bg-white border border-gray-200 p-5 rounded-2xl hover:border-black hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-1 rounded">
                                        {order.deliveryStatus || 'Assigned'}
                                    </span>
                                    <h3 className="font-bold text-gray-900 mt-2">#{order.order_number || order._id.slice(-6).toUpperCase()}</h3>
                                    <p className="text-sm font-medium text-gray-700 mt-0.5">{order.user?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Total to Collect</p>
                                    <p className="font-bold text-lg text-gray-900">
                                        {order.paymentMethod === 'cod' && !order.isPaid ? `₹${order.totalPrice}` : 'PAID'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 mb-4">
                                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                    {order.shippingAddress?.line1}, {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                                <button className="flex-1 bg-black text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest group-hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                                    <Navigation size={14} /> View Details
                                </button>
                                <a href={`tel:${order.user?.phone}`} onClick={e => e.stopPropagation()} className="w-12 h-[38px] flex items-center justify-center border border-gray-200 text-gray-600 hover:border-black rounded-lg">
                                    <Phone size={14} />
                                </a>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
