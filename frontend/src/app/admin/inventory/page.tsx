'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Warehouse, AlertTriangle, ArrowUpDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InventoryPage() {
    const { token } = useAuthStore();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: inventory, isLoading } = useQuery({
        queryKey: ['admin-inventory'],
        queryFn: async () => {
            const { data } = await api.get('/admin/inventory', { headers: { Authorization: `Bearer ${token}` } });
            return data;
        },
        enabled: !!token
    });

    const updateStockMutation = useMutation({
        mutationFn: async ({ id, stock }: { id: string, stock: number }) => {
            await api.put(`/admin/inventory/${id}`, { stock }, { headers: { Authorization: `Bearer ${token}` } });
        },
        onSuccess: () => {
            toast.success('Stock updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
        },
        onError: () => toast.error('Failed to update stock')
    });

    const handleStockChange = (id: string, currentStock: number, change: number) => {
        const newStock = Math.max(0, currentStock + change);
        updateStockMutation.mutate({ id, stock: newStock });
    };

    if (isLoading) return <div className="p-8 animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-2 bg-gray-200 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-gray-200 rounded col-span-2"></div><div className="h-2 bg-gray-200 rounded col-span-1"></div></div><div className="h-2 bg-gray-200 rounded"></div></div></div></div>;

    const items = inventory || [];
    const filtered = items.filter((i: any) =>
        i.product_id?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = items.filter((i: any) => i.stock < 10).length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-black text-gray-900 tracking-tight">Inventory Management</h1>
                    <p className="text-gray-500 mt-2">Track variants and update stock counts.</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-rose-200 px-4 py-2 rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
                        <AlertTriangle size={16} />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-gray-500">Low Stock</p>
                        <p className="font-bold text-rose-600">{lowStockCount} Variants &lt; 10</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search product or SKU..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                        <Warehouse className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                                <th className="p-4 pl-6">Product / Variant Info</th>
                                <th className="p-4">SKU</th>
                                <th className="p-4">Attributes</th>
                                <th className="p-4 text-center">Current Stock</th>
                                <th className="p-4 pr-6 text-right">Quick Adjust</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filtered.map((item: any) => (
                                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 pl-6 font-medium text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 shrink-0 border border-gray-200">
                                            {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover rounded" alt="variant" /> : <Warehouse size={16} />}
                                        </div>
                                        <div>
                                            <p className="line-clamp-1">{item.product_id?.title || 'Unknown Product'}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 font-mono">₹{item.price}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500 font-mono text-xs">{item.sku || 'N/A'}</td>
                                    <td className="p-4">
                                        <div className="flex gap-1.5 flex-wrap">
                                            {item.size && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Size: {item.size}</span>}
                                            {item.color && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: item.color.toLowerCase() }}></span>
                                                {item.color}
                                            </span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded font-bold ${item.stock < 10 ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700'}`}>
                                            {item.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleStockChange(item._id, item.stock, -1)}
                                                className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                                disabled={item.stock <= 0 || updateStockMutation.isPending}
                                            >
                                                -
                                            </button>
                                            <button
                                                onClick={() => handleStockChange(item._id, item.stock, 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                                disabled={updateStockMutation.isPending}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No variants found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
