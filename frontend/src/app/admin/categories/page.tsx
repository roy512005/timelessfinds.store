'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Layers, Plus, Pencil, Trash2 } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    productCount?: number;
}

const emptyForm = { name: '', description: '', image: '' };

export default function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...emptyForm });

    const { data, isLoading } = useQuery<Category[]>({
        queryKey: ['admin-categories'],
        queryFn: async () => {
            const { data } = await api.get('/admin/categories');
            return data;
        }
    });
    const categories: Category[] = data || [];

    const saveMutation = useMutation({
        mutationFn: async (payload: typeof form) => {
            const { data } = editId
                ? await api.put(`/admin/categories/${editId}`, payload)
                : await api.post('/admin/categories', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success(editId ? 'Category updated!' : 'Category created!');
            setShowForm(false); setEditId(null); setForm({ ...emptyForm });
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Action failed')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => { await api.delete(`/admin/categories/${id}`); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success('Category deleted');
        }
    });

    const handleEdit = (cat: Category) => {
        setForm({ name: cat.name, description: cat.description || '', image: (cat.image as string) || '' });
        setEditId(cat._id);
        setShowForm(true);
    };

    // Predefined example color seeds per category
    const colors = ['bg-rose-100', 'bg-blue-100', 'bg-emerald-100', 'bg-amber-100', 'bg-purple-100', 'bg-indigo-100'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <Layers className="w-8 h-8 text-emerald-500" /> Category Management
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Organise how products are displayed on your storefront.</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...emptyForm }); }}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Category'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 text-lg mb-5 border-b pb-3">{editId ? 'Edit' : 'New'} Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Category Name *</label>
                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Party Dresses" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Image URL</label>
                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." type="url" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Description</label>
                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description" />
                        </div>
                    </div>
                    <button
                        className="mt-5 bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        disabled={saveMutation.isPending}
                        onClick={() => saveMutation.mutate(form)}
                    >
                        {saveMutation.isPending ? 'Saving...' : editId ? 'Update Category' : '+ Create Category'}
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="bg-white rounded-2xl border p-12 text-center text-gray-400">Loading categories...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.length > 0 ? categories.map((cat, idx) => (
                        <div key={cat._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                            <div className={`h-28 ${colors[idx % colors.length]} flex items-center justify-center relative overflow-hidden`}>
                                {cat.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Layers className="w-10 h-10 text-white/60" />
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(cat)} className="p-1.5 bg-white/90 text-blue-600 rounded-lg shadow hover:bg-white">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => deleteMutation.mutate(cat._id)}
                                        className="p-1.5 bg-white/90 text-red-500 rounded-lg shadow hover:bg-white">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                                {cat.description && <p className="text-xs text-gray-500 mt-1">{cat.description}</p>}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
                            <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            No categories yet. Add your first one above.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
