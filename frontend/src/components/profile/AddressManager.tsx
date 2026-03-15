'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function AddressManager() {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '', phone: '', address_line1: '', city: '', state: '', postal_code: '', country: 'India'
    });

    const { data: addresses, isLoading } = useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            const { data } = await api.get('/users/address');
            return data;
        }
    });

    const addMutation = useMutation({
        mutationFn: async (address: any) => {
            const { data } = await api.post('/users/address', address);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            setIsAdding(false);
            setNewAddress({ name: '', phone: '', address_line1: '', city: '', state: '', postal_code: '', country: 'India' });
            toast.success('Address added successfully');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add address')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/users/address/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Address removed');
        }
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addMutation.mutate(newAddress);
    };

    if (isLoading) return <div className="text-gray-500 text-sm py-4">Loading addresses...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex justify-between items-center">
                Saved Addresses
                {!isAdding && (
                    <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
                        + Add New
                    </Button>
                )}
            </h3>

            {isAdding && (
                <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input required type="text" placeholder="Full Name" className="border p-2 rounded w-full" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
                        <input required type="text" placeholder="Phone Number" className="border p-2 rounded w-full" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                        <input required type="text" placeholder="Address Line 1" className="border p-2 rounded w-full md:col-span-2" value={newAddress.address_line1} onChange={e => setNewAddress({ ...newAddress, address_line1: e.target.value })} />
                        <input required type="text" placeholder="City" className="border p-2 rounded w-full" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                        <input required type="text" placeholder="State/Province" className="border p-2 rounded w-full" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                        <input required type="text" placeholder="Postal Code" className="border p-2 rounded w-full" value={newAddress.postal_code} onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button type="submit" disabled={addMutation.isPending}>Save Address</Button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {(!addresses || addresses.length === 0) ? (
                    <p className="text-sm text-gray-500">No saved addresses found.</p>
                ) : (
                    addresses.map((addr: any) => (
                        <div key={addr._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:border-emerald-200 transition-colors">
                            <div>
                                <h4 className="font-bold text-gray-900">{addr.name}</h4>
                                <p className="text-gray-600 font-mono text-sm mb-1">{addr.phone}</p>
                                <p className="text-gray-500 text-sm">{addr.address_line1}</p>
                                <p className="text-gray-500 text-sm">{addr.city}, {addr.state} {addr.postal_code}</p>
                            </div>
                            <button
                                onClick={() => deleteMutation.mutate(addr._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
