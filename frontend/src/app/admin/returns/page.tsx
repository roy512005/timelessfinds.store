'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { RotateCcw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ReturnRequest {
    _id: string;
    order?: { _id: string; order_number?: string; total_amount?: number };
    user?: { name: string; email: string; phone?: string };
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Refunded';
    productName?: string;
    createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Refunded: 'bg-purple-100 text-purple-700',
};

export default function ReturnsPage() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery<ReturnRequest[]>({
        queryKey: ['admin-returns'],
        queryFn: async () => {
            const { data } = await api.get('/admin/returns');
            return data;
        }
    });

    const returns: ReturnRequest[] = data || [];

    const actionMutation = useMutation({
        mutationFn: async ({ id, action }: { id: string; action: 'approve' | 'reject' }) => {
            const { data } = await api.put(`/admin/returns/${id}/${action}`);
            return data;
        },
        onSuccess: (_, { action }) => {
            queryClient.invalidateQueries({ queryKey: ['admin-returns'] });
            toast.success(action === 'approve' ? 'Return approved' : 'Return rejected');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Action failed')
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                    <RotateCcw className="w-8 h-8 text-purple-500" /> Returns & Refunds
                </h1>
                <p className="text-gray-500 mt-1 text-sm">Review and process customer return requests.</p>
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Pending', 'Approved', 'Rejected', 'Refunded'].map((s) => (
                    <div key={s} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{s}</p>
                        <p className="text-2xl font-bold font-serif text-gray-900">
                            {returns.filter(r => r.status === s).length}
                        </p>
                    </div>
                ))}
            </div>

            {isLoading ? (
                <div className="bg-white rounded-2xl border p-12 text-center text-gray-400">Loading return requests...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold">Order</th>
                                <th className="p-4 font-bold">Customer</th>
                                <th className="p-4 font-bold">Product</th>
                                <th className="p-4 font-bold">Reason</th>
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {returns.length > 0 ? returns.map(ret => (
                                <tr key={ret._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-bold text-sm text-gray-900">
                                            #{ret.order?.order_number || (ret.order?._id || '').slice(-6).toUpperCase()}
                                        </span>
                                        <br />
                                        <span className="text-xs text-gray-400">₹{(ret.order?.total_amount || 0).toLocaleString()}</span>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-sm text-gray-900">{ret.user?.name || '—'}</p>
                                        <p className="text-xs text-gray-400">{ret.user?.email}</p>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700">{ret.productName || 'N/A'}</td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs">
                                        <div className="flex items-start gap-1.5">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                            {ret.reason}
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-gray-400">
                                        {new Date(ret.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[ret.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {ret.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {ret.status === 'Pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => actionMutation.mutate({ id: ret._id, action: 'approve' })}
                                                    className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => actionMutation.mutate({ id: ret._id, action: 'reject' })}
                                                    className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                                </button>
                                            </div>
                                        )}
                                        {ret.status === 'Approved' && (
                                            <span className="text-xs text-purple-600 font-bold bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                                                Process Refund ↗
                                            </span>
                                        )}
                                        {ret.status !== 'Pending' && ret.status !== 'Approved' && (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center text-gray-400">
                                        <RotateCcw className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        No return requests at this time
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
