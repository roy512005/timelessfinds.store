'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface Product {
    _id: string;
    name: string;
    price: number;
    category?: { name: string } | string;
    stock?: number;
    images?: string[];
    status?: string;
}

export default function AdminProductsPage() {
    const queryClient = useQueryClient();
    const [showAddForm, setShowAddForm] = useState(false);
    const [form, setForm] = useState({
        name: '', price: '', discountPrice: '', stock: '',
        category: '', gender: 'Women', sizes: 'S, M, L, XL',
        description: '', summary: '', images: '', tags: '', badge: ''
    });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const { data } = await api.get('/admin/products');
            return data;
        }
    });

    const products: Product[] = data?.products || data || [];

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast.success('Product deleted');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete product')
    });

    const addMutation = useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.post('/admin/products', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            setShowAddForm(false);
            setForm({ name: '', price: '', discountPrice: '', stock: '', category: '', gender: 'Women', sizes: 'S, M, L, XL', description: '', summary: '', images: '', tags: '', badge: '' });
            toast.success('Product added successfully!');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add product')
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMutation.mutate({
            name: form.name,
            price: Number(form.price),
            discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
            stock: Number(form.stock),
            category: form.category,
            gender: form.gender,
            sizes: form.sizes.split(',').map(s => s.trim()),
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            images: form.images ? [{ url: form.images }] : [],
            description: form.description,
            summary: form.summary,
            badge: form.badge || undefined
        });
    };

    const getCategoryName = (cat: any) => {
        if (!cat) return '—';
        if (typeof cat === 'string') return cat;
        return cat.name || '—';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Product Management</h1>
                <button
                    className="bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors flex items-center"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <span className="mr-2">{showAddForm ? '✕' : '+'}</span>
                    {showAddForm ? 'Cancel' : 'Add New Product'}
                </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
                <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <h2 className="col-span-full text-lg font-bold text-gray-900 mb-2 border-b pb-2">New Product Details</h2>

                    <div className="lg:col-span-2">
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Product Name *</label>
                        <input required className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Black Evening Dress" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Image URL</label>
                        <input type="url" className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.images} onChange={e => setForm(p => ({ ...p, images: e.target.value }))} placeholder="https://..." />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Regular Price (₹) *</label>
                        <input required type="number" className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. 2999" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Discount Price (₹)</label>
                        <input type="number" className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.discountPrice} onChange={e => setForm(p => ({ ...p, discountPrice: e.target.value }))} placeholder="e.g. 1999 (Optional)" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Stock Quantity *</label>
                        <input required type="number" className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} placeholder="e.g. 12" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Gender Target</label>
                        <select className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white" value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                            <option value="Women">Women</option>
                            <option value="Men">Men</option>
                            <option value="Kids">Kids / Baby</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Category</label>
                        <input className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Party Dresses" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Available Sizes</label>
                        <input className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.sizes} onChange={e => setForm(p => ({ ...p, sizes: e.target.value }))} placeholder="S, M, L" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Product Badge / Label (e.g. Best Seller)</label>
                        <input className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.value }))} placeholder="Best Seller, Trending, Exclusive..." />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Tags (Comma Separated)</label>
                        <input className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="trending, new, gala" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Short Summary</label>
                        <textarea rows={1} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} placeholder="e.g. Luxurious silk slip dress for elegant evenings." />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Technical Description / Detail Description</label>
                        <textarea rows={3} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Detailed product specifications..." />
                    </div>

                    <button type="submit" className="col-span-full mt-4 bg-black text-white py-3 font-bold uppercase tracking-widest text-xs rounded hover:bg-rose-600 transition-colors shadow-sm" disabled={addMutation.isPending}>
                        {addMutation.isPending ? 'Publishing...' : '+ Publish Product'}
                    </button>
                </form>
            )}

            {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">Loading products...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Product Name</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Stock</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length > 0 ? products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold text-gray-900">{product.name}</td>
                                    <td className="p-4 text-gray-600">{getCategoryName(product.category)}</td>
                                    <td className="p-4 text-gray-900">₹{(product.price || 0).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${(product.stock ?? 0) < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {product.stock ?? '—'} in stock
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-3">
                                        <button className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
                                        <button
                                            className="text-red-500 hover:underline text-sm font-medium"
                                            onClick={() => deleteMutation.mutate(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">No products found. Add your first product above!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
