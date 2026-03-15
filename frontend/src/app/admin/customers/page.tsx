'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useState } from 'react';
import { User, Package, History, ExternalLink, X, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCustomersPage() {
    const queryClient = useQueryClient();
    const [roleFilter, setRoleFilter] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-customers', roleFilter],
        queryFn: async () => {
            const { data } = await api.get(`/admin/users${roleFilter ? `?role=${roleFilter}` : ''}`);
            return data;
        }
    });

    const { data: customerOrders, isLoading: loadingOrders } = useQuery({
        queryKey: ['admin-customer-orders', selectedCustomer?._id],
        queryFn: async () => {
            if (!selectedCustomer) return [];
            const { data } = await api.get(`/admin/users/${selectedCustomer._id}/orders`);
            return data;
        },
        enabled: !!selectedCustomer
    });

    const customers = data?.users || data || [];

    const blockMutation = useMutation({
        mutationFn: async ({ userId, block }: { userId: string; block: boolean }) => {
            const { data } = await api.put(`/admin/users/${userId}`, { status: block ? 'blocked' : 'active' });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
            toast.success('Customer status updated');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update status')
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <User className="w-8 h-8 text-indigo-500" /> Customer Management
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage all platform users, roles and statuses.</p>
                </div>

                <div className="flex items-center gap-3 bg-white border border-gray-100 p-1.5 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 px-3 border-r border-gray-100">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Filter By Role</span>
                    </div>
                    <select 
                        className="bg-transparent text-xs font-bold outline-none cursor-pointer px-2"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="customer">Customer</option>
                        <option value="delivery_boy">Delivery Boy</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                                    {selectedCustomer.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-gray-500">{selectedCustomer.email}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${selectedCustomer.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {selectedCustomer.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">Total Orders</p>
                                    <p className="text-3xl font-serif font-bold text-gray-900">{customerOrders?.length || 0}</p>
                                </div>
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">Joined Date</p>
                                    <p className="text-lg font-bold text-gray-900">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">Total Spent</p>
                                    <p className="text-2xl font-bold text-gray-900">₹{(customerOrders?.reduce((acc: any, curr: any) => acc + (curr.totalPrice || 0), 0) || 0).toLocaleString()}</p>
                                </div>
                            </div>

                            <h3 className="font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <History size={18} className="text-indigo-500" /> Order History
                            </h3>

                            {loadingOrders ? (
                                <div className="py-20 text-center text-gray-400">Loading order history...</div>
                            ) : customerOrders?.length > 0 ? (
                                <div className="space-y-4">
                                    {customerOrders.map((order: any) => (
                                        <div key={order._id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                                    <Package size={20} className="text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">#{order.order_number || order._id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} · {order.orderItems?.length} Items</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm text-gray-900">₹{order.totalPrice}</p>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                    No orders found for this customer.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">Loading customers...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Customer Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Phone</th>
                                <th className="p-4 font-medium">Joined</th>
                                <th className="p-4 font-medium text-center">Orders</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.length > 0 ? customers.map((cust: any) => {
                                const isBlocked = (cust.status || '').toLowerCase() === 'blocked';
                                return (
                                    <tr key={cust._id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-900">{cust.name || '—'}</td>
                                        <td className="p-4 text-gray-600">{cust.email || '—'}</td>
                                        <td className="p-4 text-gray-600">{cust.phone || '—'}</td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => setSelectedCustomer(cust)}
                                                className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                            >
                                                View History
                                            </button>
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            <button
                                                className={`${isBlocked ? 'text-green-600' : 'text-rose-600'} hover:underline text-sm font-medium`}
                                                onClick={() => blockMutation.mutate({ userId: cust._id, block: !isBlocked })}
                                                disabled={blockMutation.isPending}
                                            >
                                                {isBlocked ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">No customers found yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
