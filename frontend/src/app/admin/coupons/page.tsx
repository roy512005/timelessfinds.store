'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { TicketPercent, Plus, Pencil, Trash2 } from 'lucide-react';

interface Coupon {
    _id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount?: number;
    expires_at?: string;
    is_active?: boolean;
}

const emptyForm = { code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', expires_at: '' };

export default function AdminCouponsPage() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<any>({ ...emptyForm });

    const { data, isLoading } = useQuery<Coupon[]>({
        queryKey: ['admin-coupons'],
        queryFn: async () => {
            const { data } = await api.get('/admin/coupons');
            return data;
        }
    });
    const coupons: Coupon[] = data || [];

    const saveMutation = useMutation({
        mutationFn: async (payload: any) => {
            const body = { ...payload, discount_value: Number(payload.discount_value), min_order_amount: Number(payload.min_order_amount) || 0 };
            const { data } = editId
                ? await api.put(`/admin/coupons/${editId}`, body)
                : await api.post('/admin/coupons', body);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
            toast.success(editId ? 'Coupon updated!' : 'Coupon created!');
            setShowForm(false); setEditId(null); setForm({ ...emptyForm });
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Action failed')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => { await api.delete(`/admin/coupons/${id}`); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
            toast.success('Coupon deleted');
        }
    });

    const handleEdit = (c: Coupon) => {
        setForm({ code: c.code, discount_type: c.discount_type, discount_value: String(c.discount_value), min_order_amount: String(c.min_order_amount || ''), expires_at: c.expires_at ? c.expires_at.slice(0, 10) : '' });
        setEditId(c._id);
        setShowForm(true);
    };

    const isExpired = (d?: string) => d && new Date(d) < new Date();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <TicketPercent className="w-8 h-8 text-pink-500" /> Coupons & Discounts
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Create and manage promotional discount codes.</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...emptyForm }); }}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'New Coupon'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 text-lg mb-5 border-b pb-3">{editId ? 'Edit' : 'New'} Coupon</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { label: 'Coupon Code *', key: 'code', placeholder: 'e.g. SUMMER20' },
                            { label: 'Discount Value *', key: 'discount_value', placeholder: 'e.g. 20', type: 'number' },
                            { label: 'Min Order Amount (₹)', key: 'min_order_amount', placeholder: 'e.g. 500', type: 'number' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{f.label}</label>
                                <input type={f.type || 'text'} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    value={form[f.key]} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Discount Type</label>
                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                value={form.discount_type} onChange={e => setForm((p: any) => ({ ...p, discount_type: e.target.value }))}>
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Expiry Date</label>
                            <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                value={form.expires_at} onChange={e => setForm((p: any) => ({ ...p, expires_at: e.target.value }))} />
                        </div>
                    </div>
                    <button className="mt-5 bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-pink-600 transition-colors disabled:opacity-50"
                        disabled={saveMutation.isPending} onClick={() => saveMutation.mutate(form)}>
                        {saveMutation.isPending ? 'Saving...' : editId ? 'Update Coupon' : '+ Create Coupon'}
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="bg-white rounded-2xl border p-12 text-center text-gray-400">Loading coupons...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold">Code</th>
                                <th className="p-4 font-bold">Discount</th>
                                <th className="p-4 font-bold">Min Order</th>
                                <th className="p-4 font-bold">Expiry</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coupons.length > 0 ? coupons.map(c => (
                                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg text-sm tracking-wider">
                                            {c.code}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-pink-600 text-sm">
                                        {c.discount_value}{c.discount_type === 'percentage' ? '%' : '₹'} OFF
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{c.min_order_amount ? `₹${c.min_order_amount}` : 'No Min'}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : 'No Expiry'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isExpired(c.expires_at) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {isExpired(c.expires_at) ? 'Expired' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteMutation.mutate(c._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-400">
                                        <TicketPercent className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        No coupons created yet
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
