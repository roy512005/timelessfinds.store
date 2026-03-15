'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import {
    ArrowUpRight, ArrowDownRight, IndianRupee,
    ShoppingBag, Users as UsersIcon, Clock,
    AlertTriangle, PackageOpen
} from 'lucide-react';

export default function AdminDashboardPage() {
    const { data: salesData } = useQuery({
        queryKey: ['admin-analytics-sales'],
        queryFn: async () => {
            const { data } = await api.get('/admin/analytics/sales');
            return data;
        }
    });

    const { data: recentOrdersData } = useQuery({
        queryKey: ['admin-recent-orders'],
        queryFn: async () => {
            const { data } = await api.get('/admin/orders?limit=5&page=1');
            return data;
        }
    });

    const { data: lowStockData } = useQuery({
        queryKey: ['admin-low-stock'],
        queryFn: async () => {
            const { data } = await api.get('/admin/inventory/low-stock');
            return data;
        }
    });

    const stats = salesData || {};
    const recentOrders = recentOrdersData?.orders || recentOrdersData || [];
    const lowStock = lowStockData || [];

    const statusColors: Record<string, string> = {
        delivered: 'bg-green-100 text-green-800',
        processing: 'bg-yellow-100 text-yellow-800',
        shipped: 'bg-blue-100 text-blue-800',
        cancelled: 'bg-red-100 text-red-800',
        pending: 'bg-gray-100 text-gray-800',
        refunded: 'bg-purple-100 text-purple-800',
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time metrics and alerts for Timeless Finds.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        Export CSV
                    </button>
                    <button className="px-4 py-2 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                        + New Order
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {/* Orders Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-blue-100 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Orders Today</h3>
                            <p className="text-3xl font-bold font-serif text-gray-900">{stats.ordersToday || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center text-xs">
                        <span className="text-green-600 flex items-center font-bold bg-green-50 px-2 py-0.5 rounded mr-2">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" /> 8%
                        </span>
                        <span className="text-gray-400">Total: {stats.totalOrders || 0}</span>
                    </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-emerald-100 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Revenue Today</h3>
                            <p className="text-3xl font-bold font-serif text-gray-900">₹{(stats.revenueToday || 0).toLocaleString()}</p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center text-xs">
                        <span className="text-green-600 flex items-center font-bold bg-green-50 px-2 py-0.5 rounded mr-2">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12.5%
                        </span>
                        <span className="text-gray-400">Total: ₹{(stats.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                </div>

                {/* Customers Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-purple-100 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">New Customers</h3>
                            <p className="text-3xl font-bold font-serif text-gray-900">{stats.newUsers || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <UsersIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center text-xs">
                        <span className="text-gray-400">Active ecosystem: <span className="font-bold text-gray-700">{stats.totalCustomers || 0}</span></span>
                    </div>
                </div>

                {/* Pending Tasks Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-amber-100 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Orders</h3>
                            <p className="text-3xl font-bold font-serif text-gray-900">
                                {recentOrders.filter((o: any) => o.status === 'Pending').length || 0}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center text-xs">
                        <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                            Action required
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders List */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <PackageOpen className="w-5 h-5 text-gray-500" />
                            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        </div>
                        <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-md">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentOrders.length > 0 ? recentOrders.slice(0, 5).map((order: any) => (
                            <div key={order._id} className="flex justify-between items-center p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                                        {(order.user?.name || order.customer || 'C')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">#{(order._id || '').slice(-6).toUpperCase()}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{order.user?.name || order.customer || 'Guest Customer'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-gray-900 mb-1">₹{(order.totalAmount || order.total || 0).toLocaleString()}</p>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${statusColors[(order.status || '').toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                                <PackageOpen className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <h2 className="text-lg font-bold text-gray-900">Critical Stock Alerts</h2>
                        </div>
                        <Link href="/admin/products" className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-md">Manage</Link>
                    </div>
                    <div className="p-6 space-y-4">
                        {lowStock.length > 0 ? lowStock.slice(0, 5).map((item: any) => (
                            <div key={item._id} className="flex justify-between items-center p-4 bg-red-50/50 border border-red-100 rounded-xl relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>
                                <div className="pl-2">
                                    <span className="font-bold text-sm text-gray-900 block mb-0.5">
                                        {item.product?.name || item.name || 'Unknown Product'}
                                    </span>
                                    {item.size && (
                                        <span className="text-xs text-gray-500">Variant: Size {item.size}</span>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-md block mb-1">
                                        {item.stock ?? item.quantity ?? 0} Remaining
                                    </span>
                                    <button className="text-[10px] text-red-600 font-bold uppercase tracking-wider hover:underline">Restock</button>
                                </div>
                            </div>
                        )) : (
                            <div className="p-4 text-center text-gray-400 flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-100 rounded-xl">
                                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-600">Inventory is healthy</p>
                                <p className="text-xs text-gray-400 mt-1">No low stock alerts detected 🎉</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
