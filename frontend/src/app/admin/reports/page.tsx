'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

const RevenueTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
            <p className="font-bold text-gray-700 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">
                    {p.name}: ₹{Number(p.value || 0).toLocaleString()}
                </p>
            ))}
        </div>
    );
};

const OrderTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
            <p className="font-bold text-gray-700 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    );
};

export default function AdminReportsPage() {
    const { data: dailyData } = useQuery({
        queryKey: ['analytics-daily'],
        queryFn: async () => {
            const { data } = await api.get('/admin/analytics/daily');
            return data;
        }
    });

    const { data: monthlyData } = useQuery({
        queryKey: ['analytics-monthly'],
        queryFn: async () => {
            const { data } = await api.get('/admin/analytics/monthly');
            return data;
        }
    });

    const { data: topProductsData } = useQuery({
        queryKey: ['analytics-top-products'],
        queryFn: async () => {
            const { data } = await api.get('/admin/analytics/top-products');
            return data;
        }
    });

    const { data: stats } = useQuery({
        queryKey: ['admin-analytics-sales'],
        queryFn: async () => {
            const { data } = await api.get('/admin/analytics/sales');
            return data;
        }
    });

    const daily = dailyData || [];
    const monthly = monthlyData || [];
    const topProducts = topProductsData || [];
    const s = stats || {};

    const summaryCards = [
        { label: 'Total Revenue', value: `₹${(s.totalRevenue || 0).toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'Revenue Today', value: `₹${(s.revenueToday || 0).toLocaleString()}`, color: 'text-blue-600' },
        { label: 'Total Orders', value: s.totalOrders || 0, color: 'text-indigo-600' },
        { label: 'Orders Today', value: s.ordersToday || 0, color: 'text-amber-600' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-indigo-500" /> Reports & Analytics
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Live business performance from your database.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryCards.map(c => (
                    <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                        <p className={`text-2xl font-bold font-serif ${c.color}`}>{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Daily Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-bold text-gray-900">Daily Sales — Last 7 Days</h2>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={daily}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                            tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip content={<RevenueTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} name="Revenue" />
                        <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} name="Orders" yAxisId="right" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-5">Monthly Revenue</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
                                formatter={(v: unknown) => [`₹${Number(v || 0).toLocaleString()}`, 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} name="Revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-5">Top Products by Orders</h2>
                    {topProducts.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} />
                                <Tooltip content={<OrderTooltip />} />
                                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
                            No product order data yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
