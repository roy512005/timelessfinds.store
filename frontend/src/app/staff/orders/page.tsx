'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

const STATUS_SEQUENCE: Record<string, string> = {
    pending: 'Confirmed',
    confirmed: 'Processing',
    processing: 'Shipped',
    shipped: 'Delivered',
};

const statusColors: Record<string, string> = {
    delivered: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
};

export default function StaffOrdersPage() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['staff-orders-pipeline'],
        queryFn: async () => {
            const { data } = await api.get('/admin/orders');
            return data;
        }
    });

    const orders: any[] = data?.orders || data || [];

    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
            const { data } = await api.put(`/admin/orders/${orderId}/status`, { status });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff-orders-pipeline'] });
            toast.success('Order status updated');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update')
    });

    return (
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Order Processing Pipeline</h1>

            {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">Loading orders...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Order ID</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Items</th>
                                <th className="p-4 font-medium">Total</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Fulfillment Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length > 0 ? orders.map((order: any) => {
                                const statusKey = (order.status || 'pending').toLowerCase();
                                const nextStatus = STATUS_SEQUENCE[statusKey];

                                return (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-900 font-mono text-sm">#{(order._id || '').slice(-8).toUpperCase()}</td>
                                        <td className="p-4 text-gray-600">{order.user?.name || 'Guest'}</td>
                                        <td className="p-4 text-gray-900">{(order.items || []).length}</td>
                                        <td className="p-4 font-bold text-gray-900">₹{(order.totalAmount || 0).toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${statusColors[statusKey] || 'bg-gray-100 text-gray-800'}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {nextStatus ? (
                                                <button
                                                    className={`px-3 py-1.5 rounded text-xs font-bold text-white transition-colors ${nextStatus === 'Confirmed' ? 'bg-black hover:bg-gray-800' :
                                                            nextStatus === 'Processing' ? 'bg-amber-600 hover:bg-amber-700' :
                                                                nextStatus === 'Shipped' ? 'bg-blue-600 hover:bg-blue-700' :
                                                                    'bg-green-600 hover:bg-green-700'
                                                        }`}
                                                    onClick={() => updateStatusMutation.mutate({ orderId: order._id, status: nextStatus })}
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    Mark {nextStatus}
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400 capitalize">{order.status}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">No orders in the pipeline</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
