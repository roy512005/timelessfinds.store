'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function StaffInventoryPage() {
    const queryClient = useQueryClient();
    const [localStock, setLocalStock] = useState<Record<string, number>>({});
    const [search, setSearch] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['staff-inventory'],
        queryFn: async () => {
            const { data } = await api.get('/admin/inventory');
            return data;
        }
    });

    const products: any[] = data?.products || data?.inventory || data || [];

    const filteredProducts = search
        ? products.filter((p: any) =>
            (p.name || p.product?.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.sku || '').toLowerCase().includes(search.toLowerCase())
        )
        : products;

    const updateStockMutation = useMutation({
        mutationFn: async ({ variantId, stock }: { variantId: string; stock: number }) => {
            const { data } = await api.put(`/admin/inventory/${variantId}`, { stock });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff-inventory'] });
            toast.success('Stock updated!');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update stock')
    });

    return (
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Stock & Inventory</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex space-x-4 max-w-xl">
                <input
                    type="text"
                    placeholder="Search product name or SKU..."
                    className="flex-1 border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">Loading inventory...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">SKU</th>
                                <th className="p-4 font-medium">Product Name</th>
                                <th className="p-4 font-medium">Current Stock</th>
                                <th className="p-4 font-medium text-right">Quick Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length > 0 ? filteredProducts.map((product: any) => {
                                const id = product._id;
                                const currentStock = localStock[id] ?? product.stock ?? product.quantity ?? 0;
                                const name = product.name || product.product?.name || 'Product';
                                const sku = product.sku || id?.slice(-8).toUpperCase() || '—';

                                return (
                                    <tr key={id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono text-gray-600 text-sm">{sku}</td>
                                        <td className="p-4 font-bold text-gray-900">{name}</td>
                                        <td className="p-4 text-gray-900 font-bold">
                                            <span className={currentStock <= 5 ? 'text-rose-600' : 'text-gray-900'}>{currentStock}</span>
                                            {currentStock <= 5 && <span className="ml-2 text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">LOW</span>}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                                    onClick={() => setLocalStock(s => ({ ...s, [id]: Math.max(0, currentStock - 1) }))}
                                                >-</button>
                                                <span className="w-12 text-center font-bold">{currentStock}</span>
                                                <button
                                                    className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                                    onClick={() => setLocalStock(s => ({ ...s, [id]: currentStock + 1 }))}
                                                >+</button>
                                                <button
                                                    className="ml-4 bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-amber-600 transition-colors"
                                                    onClick={() => updateStockMutation.mutate({ variantId: id, stock: currentStock })}
                                                    disabled={updateStockMutation.isPending}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">No inventory items found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
