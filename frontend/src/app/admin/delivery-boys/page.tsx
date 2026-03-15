'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Truck, Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface DeliveryBoy {
    _id: string;
    name: string;
    phoneNumber: string;
    address: string;
    vehicleType: string;
    status: 'Active' | 'Inactive';
    createdAt?: string;
}

const emptyForm = { name: '', phoneNumber: '', address: '', vehicleType: 'Bike', status: 'Active' };

export default function DeliveryBoysPage() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...emptyForm });

    const { data, isLoading } = useQuery<DeliveryBoy[]>({
        queryKey: ['admin-delivery-boys'],
        queryFn: async () => {
            const { data } = await api.get('/admin/delivery-boys');
            return data;
        }
    });

    const boys: DeliveryBoy[] = data || [];

    const createMutation = useMutation({
        mutationFn: async (payload: typeof form) => {
            const { data } = editId
                ? await api.put(`/admin/delivery-boys/${editId}`, payload)
                : await api.post('/admin/delivery-boys', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-delivery-boys'] });
            toast.success(editId ? 'Delivery boy updated!' : 'Delivery boy added!');
            setShowForm(false);
            setEditId(null);
            setForm({ ...emptyForm });
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Action failed')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => { await api.delete(`/admin/delivery-boys/${id}`); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-delivery-boys'] });
            toast.success('Delivery boy removed');
        }
    });

    const handleEdit = (boy: DeliveryBoy) => {
        setForm({ name: boy.name, phoneNumber: boy.phoneNumber, address: boy.address, vehicleType: boy.vehicleType, status: boy.status });
        setEditId(boy._id);
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <Truck className="w-8 h-8 text-blue-500" /> Delivery Boys
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage field delivery staff and assignments.</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...emptyForm }); }}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" />{showForm ? 'Cancel' : 'Add Delivery Boy'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 text-lg mb-5 border-b pb-3">{editId ? 'Edit' : 'New'} Delivery Boy</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { label: 'Full Name *', key: 'name', placeholder: 'e.g. Rahul Sharma' },
                            { label: 'Phone Number *', key: 'phoneNumber', placeholder: 'e.g. 9876543210' },
                            { label: 'Address *', key: 'address', placeholder: 'Full address' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{f.label}</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    value={(form as any)[f.key]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder}
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Vehicle Type</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                value={form.vehicleType}
                                onChange={e => setForm(p => ({ ...p, vehicleType: e.target.value }))}
                            >
                                {['Bike', 'Scooter', 'Cycle', 'Auto', 'Van'].map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Status</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                value={form.status}
                                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <button
                        className="mt-5 bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50"
                        disabled={createMutation.isPending}
                        onClick={() => createMutation.mutate(form)}
                    >
                        {createMutation.isPending ? 'Saving...' : editId ? 'Update Boy' : '+ Add Boy'}
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="bg-white rounded-2xl border p-12 text-center text-gray-400">Loading delivery staff...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold">Name</th>
                                <th className="p-4 font-bold">Phone</th>
                                <th className="p-4 font-bold">Vehicle</th>
                                <th className="p-4 font-bold">Address</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {boys.length > 0 ? boys.map(boy => (
                                <tr key={boy._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                                {boy.name[0].toUpperCase()}
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm">{boy.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{boy.phoneNumber}</td>
                                    <td className="p-4">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{boy.vehicleType}</span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{boy.address}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${boy.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {boy.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {boy.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEdit(boy)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteMutation.mutate(boy._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-400">
                                        <Truck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        No delivery boys added yet
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
