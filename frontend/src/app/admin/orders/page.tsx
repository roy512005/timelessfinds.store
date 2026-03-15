'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { ShoppingCart, Truck, Printer } from 'lucide-react';

interface Order {
    _id: string;
    order_number?: string;
    user?: { name: string; email: string };
    total_amount?: number;
    totalPrice?: number;
    status: string;
    deliveryStatus?: string;
    assignedDeliveryBoy?: string;
    paymentMethod?: string;
    createdAt: string;
    isPaid?: boolean;
}

interface DeliveryBoy { _id: string; name: string; status: string; }

const STATUS_FLOW = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    confirmed: 'bg-blue-100 text-blue-700',
    packed: 'bg-indigo-100 text-indigo-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    returned: 'bg-purple-100 text-purple-700',
};

export default function AdminOrdersPage() {
    const queryClient = useQueryClient();
    const [assignModal, setAssignModal] = useState<Order | null>(null);
    const [selectedBoy, setSelectedBoy] = useState('');

    const { data: ordersData, isLoading } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const { data } = await api.get('/admin/orders');
            return data;
        }
    });

    const { data: boysData } = useQuery<DeliveryBoy[]>({
        queryKey: ['admin-delivery-boys'],
        queryFn: async () => {
            const { data } = await api.get('/admin/delivery-boys');
            return data;
        }
    });

    const orders: Order[] = ordersData?.orders || ordersData || [];
    const boys: DeliveryBoy[] = (boysData || []).filter((b) => b.status === 'Active');

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { data } = await api.put(`/admin/orders/${id}/status`, { status });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            toast.success('Order status updated');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update status')
    });

    const assignMutation = useMutation({
        mutationFn: async ({ orderId, deliveryBoyId }: { orderId: string; deliveryBoyId: string }) => {
            const { data } = await api.post('/admin/assign-delivery', { orderId, deliveryBoyId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            toast.success('Order assigned to delivery boy!');
            setAssignModal(null);
            setSelectedBoy('');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Assignment failed')
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-indigo-500" /> Order Management
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">View, update and assign all customer orders.</p>
                </div>
                <div className="flex gap-2">
                    <div className="text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2">
                        Total: <span className="text-gray-900 text-base">{orders.length}</span>
                    </div>
                </div>
            </div>

            {/* Assign Modal */}
            {assignModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold font-serif mb-2">Assign Delivery Boy</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Order #{assignModal.order_number || assignModal._id.slice(-6).toUpperCase()}
                        </p>
                        <select
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black mb-4"
                            value={selectedBoy}
                            onChange={e => setSelectedBoy(e.target.value)}
                        >
                            <option value="">Select a delivery boy...</option>
                            {boys.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                        <div className="flex gap-3">
                            <button
                                disabled={!selectedBoy || assignMutation.isPending}
                                onClick={() => assignMutation.mutate({ orderId: assignModal._id, deliveryBoyId: selectedBoy })}
                                className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-40"
                            >
                                {assignMutation.isPending ? 'Assigning...' : 'Assign & Dispatch'}
                            </button>
                            <button onClick={() => setAssignModal(null)} className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="bg-white rounded-2xl border p-12 text-center text-gray-400">Loading orders...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold">Order ID</th>
                                <th className="p-4 font-bold">Customer</th>
                                <th className="p-4 font-bold">Total</th>
                                <th className="p-4 font-bold">Payment</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold">Delivery</th>
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900 text-sm">
                                        #{order.order_number || order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-sm text-gray-900">{order.user?.name || 'Guest'}</p>
                                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                                    </td>
                                    <td className="p-4 font-bold text-sm text-gray-900">
                                        ₹{(order.total_amount || order.totalPrice || 0).toLocaleString()}
                                        <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{order.paymentMethod || '—'}</td>
                                    <td className="p-4">
                                        <select
                                            className={`text-xs font-bold px-2 py-1.5 rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}
                                            value={order.status}
                                            onChange={e => statusMutation.mutate({ id: order._id, status: e.target.value })}
                                        >
                                            {STATUS_FLOW.map(s => (
                                                <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.deliveryStatus === 'Delivered' ? 'bg-green-100 text-green-700' : order.deliveryStatus === 'Assigned' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {order.deliveryStatus || 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setAssignModal(order)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Assign Delivery Boy"
                                            >
                                                <Truck className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Print Invoice">
                                                <Printer className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="p-10 text-center text-gray-400">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
