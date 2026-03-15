'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AdminStaffPage() {
    const queryClient = useQueryClient();
    const [showAddForm, setShowAddForm] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-staff'],
        queryFn: async () => {
            // fetch users with role = staff or admin (non-customer)
            const { data } = await api.get('/admin/users?role=staff');
            return data;
        }
    });

    const staff: any[] = data?.users || data || [];

    const revokeAccessMutation = useMutation({
        mutationFn: async (userId: string) => {
            await api.put(`/admin/users/${userId}`, { status: 'blocked' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
            toast.success('Access revoked');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to revoke access')
    });

    const addStaffMutation = useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.post('/auth/register', { ...payload, role: 'staff' });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
            setShowAddForm(false);
            setForm({ name: '', email: '', password: '', role: 'staff' });
            toast.success('Staff member added!');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add staff')
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addStaffMutation.mutate(form);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Staff Management</h1>
                <button
                    className="bg-rose-600 text-white px-4 py-2 rounded font-medium hover:bg-rose-700 transition-colors flex items-center shadow-lg shadow-rose-600/20"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <span className="mr-2">{showAddForm ? '✕' : '+'}</span>
                    {showAddForm ? 'Cancel' : 'Add New Staff'}
                </button>
            </div>

            {/* Add Staff Form */}
            {showAddForm && (
                <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h2 className="col-span-full text-lg font-bold text-gray-900 mb-2">New Staff Account</h2>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Full Name *</label>
                        <input required className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sonia Kapoor" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Email *</label>
                        <input required type="email" className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="staff@timelessfinds.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Password *</label>
                        <input required type="password" className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="min 8 characters" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Role</label>
                        <select className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="col-span-full bg-rose-600 text-white py-2 font-medium rounded hover:bg-rose-700 transition-colors" disabled={addStaffMutation.isPending}>
                        {addStaffMutation.isPending ? 'Adding...' : 'Create Staff Account'}
                    </button>
                </form>
            )}

            {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">Loading staff...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Joined</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {staff.length > 0 ? staff.map((person: any) => {
                                const isBlocked = (person.status || '').toLowerCase() === 'blocked';
                                return (
                                    <tr key={person._id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-900">{person.name || '—'}</td>
                                        <td className="p-4 text-gray-600">{person.email || '—'}</td>
                                        <td className="p-4 text-gray-900 capitalize">{person.role || 'staff'}</td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {person.createdAt ? new Date(person.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${isBlocked ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                                                {isBlocked ? 'Inactive' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            <button
                                                className="text-rose-600 hover:underline text-sm font-medium"
                                                onClick={() => revokeAccessMutation.mutate(person._id)}
                                                disabled={isBlocked}
                                            >
                                                {isBlocked ? 'Revoked' : 'Revoke Access'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">No staff members added yet. Add your first staff member above!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
