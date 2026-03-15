'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusColors: Record<string, string> = {
    delivered: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
};

export default function StaffDashboardPage() {
    const queryClient = useQueryClient();
    const [skuSearch, setSkuSearch] = useState('');

    // Fetch pending/new orders for staff
    const { data, isLoading } = useQuery({
        queryKey: ['staff-orders'],
        queryFn: async () => {
            const { data } = await api.get('/admin/orders?status=Pending&status=Confirmed');
            return data;
        }
    });

    const orders = data?.orders || data || [];

    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
            const { data } = await api.put(`/admin/orders/${orderId}/status`, { status });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff-orders'] });
            toast.success('Order status updated');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update')
    });

    // Stock search
    const { data: productSearchResult, refetch: searchProduct, isFetching: isSearching } = useQuery({
        queryKey: ['staff-sku-search', skuSearch],
        queryFn: async () => {
            if (!skuSearch.trim()) return null;
            const { data } = await api.get(`/products/search?q=${encodeURIComponent(skuSearch)}`);
            return data;
        },
        enabled: false,
    });

    return (
        <div>
            <h1 className="text-3xl font-serif font-bold mb-8 text-gray-900">Staff Portal</h1>

            {/* Action Required: New Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Action Required: New Orders</h2>
                        <span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-full">{orders.length} pending</span>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-400">Loading orders...</div>
                    ) : orders.length > 0 ? orders.map((order: any) => (
                        <div key={order._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <span className="font-bold text-lg font-mono">#{(order._id || '').slice(-8).toUpperCase()}</span>
                                    <span className={`text-xs px-2 py-1 rounded uppercase tracking-wider font-bold ${statusColors[(order.status || '').toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                                        {order.status || 'New'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Customer: {order.user?.name || 'Guest'} •
                                    Items: {(order.items || []).length} •
                                    Total: ₹{(order.totalAmount || 0).toLocaleString()}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : ''}
                                </p>
                            </div>
                            <div className="flex space-x-2 w-full md:w-auto">
                                <button
                                    className="flex-1 md:flex-none bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors text-sm"
                                    onClick={() => updateStatusMutation.mutate({ orderId: order._id, status: 'Confirmed' })}
                                    disabled={order.status === 'Confirmed'}
                                >
                                    {order.status === 'Confirmed' ? '✓ Confirmed' : 'Confirm Order'}
                                </button>
                                <button
                                    className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors text-sm"
                                    onClick={() => updateStatusMutation.mutate({ orderId: order._id, status: 'Processing' })}
                                >
                                    Mark Processing
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-gray-400">No pending orders 🎉</div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Inventory Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Inventory Check</h2>
                    <p className="text-gray-500 text-sm mb-4">Search for a product name or SKU to check stock levels.</p>
                    <div className="flex space-x-2 mb-4">
                        <input
                            type="text"
                            placeholder="Product name or SKU..."
                            className="flex-1 border p-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
                            value={skuSearch}
                            onChange={e => setSkuSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && searchProduct()}
                        />
                        <button
                            className="bg-gray-900 text-white px-4 py-2 rounded font-medium hover:bg-gray-700 transition-colors"
                            onClick={() => searchProduct()}
                            disabled={isSearching}
                        >
                            {isSearching ? '...' : 'Search'}
                        </button>
                    </div>
                    {productSearchResult && (
                        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                            {(productSearchResult.products || productSearchResult || []).slice(0, 5).map((p: any) => (
                                <div key={p._id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                                    <span className="font-medium">{p.name}</span>
                                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${(p.stock || 0) < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {p.stock ?? '—'} in stock
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Support Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Support Cases</h2>
                    <p className="text-gray-500 text-sm mb-4">Customer support tickets waiting for response.</p>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                        <p className="text-blue-700 font-medium text-sm">Support desk integration coming soon</p>
                        <p className="text-blue-500 text-xs mt-1">Tickets will appear here once the support module is configured.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
