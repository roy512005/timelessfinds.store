'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Home, MapPin, Building2, Edit3, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Address {
    _id: string;
    label: 'Home' | 'Work' | 'Other';
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

const emptyForm = { label: 'Home', name: '', phone: '', line1: '', city: '', state: '', pincode: '', isDefault: false };

export default function AddressesPage() {
    const { token } = useAuthStore();
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<any>({ ...emptyForm });

    const { data, isLoading } = useQuery<Address[]>({
        queryKey: ['user-addresses'],
        queryFn: async () => {
            const { data } = await api.get('/users/address', { headers: { Authorization: `Bearer ${token}` } });
            return data.addresses || data || [];
        },
        enabled: !!token,
    });
    const addresses: Address[] = data || [];

    const saveMutation = useMutation({
        mutationFn: async (payload: typeof form) => {
            if (editId) {
                const { data } = await api.put(`/users/address/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                return data;
            }
            const { data } = await api.post('/users/address', payload, { headers: { Authorization: `Bearer ${token}` } });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
            toast.success(editId ? 'Address updated!' : 'Address saved successfully.');
            setIsAdding(false);
            setEditId(null);
            setForm({ ...emptyForm });
        },
        onError: () => toast.error('Failed to save address. Please try again.')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/users/address/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
            toast.success('Address removed.');
        }
    });

    const handleEdit = (addr: Address) => {
        setForm({ label: addr.label, name: addr.name, phone: addr.phone, line1: addr.line1, city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
        setEditId(addr._id);
        setIsAdding(true);
    };

    const LabelIcon = ({ label }: { label: string }) => {
        if (label === 'Home') return <Home size={16} />;
        if (label === 'Work') return <Building2 size={16} />;
        return <MapPin size={16} />;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-black text-gray-900 tracking-tight">
                        Saved Addresses
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Manage your delivery locations for faster checkout.
                    </p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => { setIsAdding(true); setEditId(null); setForm({ ...emptyForm }); }}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors"
                    >
                        <Plus size={14} /> Add New
                    </button>
                )}
            </div>

            {isAdding ? (
                <div className="bg-gray-50 border border-gray-100 p-6 md:p-8 rounded-sm animate-in zoom-in-95 duration-300">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin size={16} className="text-rose-500" /> {editId ? 'Edit' : 'New'} Delivery Address
                    </h3>
                    <div className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name *</label>
                                <input required type="text" value={form.name} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))}
                                    className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-black focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number *</label>
                                <input required type="tel" value={form.phone} onChange={e => setForm((p: any) => ({ ...p, phone: e.target.value }))}
                                    className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-black focus:outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Address Line 1 *</label>
                            <input required type="text" value={form.line1} onChange={e => setForm((p: any) => ({ ...p, line1: e.target.value }))}
                                className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-black focus:outline-none" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Pincode *</label>
                                <input required type="text" value={form.pincode} onChange={e => setForm((p: any) => ({ ...p, pincode: e.target.value }))}
                                    className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-black focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">City *</label>
                                <input required type="text" value={form.city} onChange={e => setForm((p: any) => ({ ...p, city: e.target.value }))}
                                    className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-black focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">State *</label>
                                <input required type="text" value={form.state} onChange={e => setForm((p: any) => ({ ...p, state: e.target.value }))}
                                    className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-black focus:outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Label</label>
                            <select value={form.label} onChange={e => setForm((p: any) => ({ ...p, label: e.target.value }))}
                                className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-black focus:outline-none bg-white">
                                <option>Home</option>
                                <option>Work</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <input type="checkbox" id="default" checked={form.isDefault}
                                onChange={e => setForm((p: any) => ({ ...p, isDefault: e.target.checked }))} className="w-4 h-4 accent-black" />
                            <label htmlFor="default" className="text-sm text-gray-600">Make this my default address</label>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                disabled={saveMutation.isPending}
                                onClick={() => saveMutation.mutate(form)}
                                className="bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {saveMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                                {editId ? 'Update Address' : 'Save Address'}
                            </button>
                            <button type="button" onClick={() => { setIsAdding(false); setEditId(null); }}
                                className="bg-white border border-gray-200 text-gray-600 px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(n => <div key={n} className="h-48 bg-gray-100 rounded-sm animate-pulse" />)}
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-sm">
                    <MapPin size={32} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No saved addresses yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Add one above to speed up your checkout.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr._id} className={`border p-6 rounded-sm relative group transition-colors ${addr.isDefault ? 'border-rose-200 bg-rose-50/20 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                            {addr.isDefault && (
                                <span className="absolute top-0 right-0 bg-rose-100 text-rose-700 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-md">
                                    Default
                                </span>
                            )}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                                    <LabelIcon label={addr.label} />
                                </div>
                                <div>
                                    <h4 className="font-serif font-bold text-gray-900">{addr.name}</h4>
                                    <p className="text-xs text-gray-500 tracking-wide">{addr.phone}</p>
                                </div>
                                <span className="ml-auto text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{addr.label}</span>
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed mb-6">
                                <p>{addr.line1}</p>
                                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                <button onClick={() => handleEdit(addr)} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1.5 transition-colors">
                                    <Edit3 size={12} /> Edit
                                </button>
                                <button onClick={() => deleteMutation.mutate(addr._id)}
                                    className="text-xs font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700 flex items-center gap-1.5 transition-colors">
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
