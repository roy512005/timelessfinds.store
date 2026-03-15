'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminCollectionsPage() {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        image: '',
        tags: '',
        isActive: true,
    });

    const { data: collections, isLoading } = useQuery({
        queryKey: ['admin-collections'],
        queryFn: async () => {
            const { data } = await api.get('/collections/admin');
            return data;
        }
    });

    const addMutation = useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.post('/collections/admin', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
            toast.success('Collection created!');
            resetForm();
        },
        onError: () => toast.error('Failed to create collection')
    });

    const updateMutation = useMutation({
        mutationFn: async (payload: { id: string, data: any }) => {
            const { data } = await api.put(`/collections/admin/${payload.id}`, payload.data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
            toast.success('Collection updated!');
            resetForm();
        },
        onError: () => toast.error('Failed to update collection')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/collections/admin/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
            toast.success('Collection deleted!');
        },
        onError: () => toast.error('Failed to delete collection')
    });

    const resetForm = () => {
        setFormData({ title: '', slug: '', description: '', image: '', tags: '', isActive: true });
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleEdit = (col: any) => {
        setFormData({
            title: col.title,
            slug: col.slug,
            description: col.description,
            image: col.image,
            tags: col.tags?.join(', ') || '',
            isActive: col.isActive,
        });
        setEditingId(col._id);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };

        if (editingId) {
            updateMutation.mutate({ id: editingId, data: payload });
        } else {
            addMutation.mutate(payload);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Collections</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage seasonal capsules and edits.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                    className="flex items-center space-x-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Collection</span>
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif">
                        {editingId ? 'Edit Collection' : 'Create New Collection'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Title</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Slug</label>
                                <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Description</label>
                                <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Image URL</label>
                                <input required type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Tags (Comma Separated)</label>
                                <input type="text" placeholder="Resort, Linen, Elegant" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="rounded text-black focus:ring-black w-4 h-4 cursor-pointer" />
                                <span className="text-sm font-medium text-gray-700">Active (Visible to users)</span>
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4 border-t border-gray-100">
                            <button type="submit" disabled={addMutation.isPending || updateMutation.isPending} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50">
                                {editingId ? 'Update Collection' : 'Create Collection'}
                            </button>
                            <button type="button" onClick={resetForm} className="bg-white border text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400 font-medium">Loading Collections...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <th className="p-4">Image</th>
                                <th className="p-4">Details</th>
                                <th className="p-4">Tags</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {collections?.map((col: any) => (
                                <tr key={col._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                            {col.image ? (
                                                <img src={col.image} alt={col.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <span className="text-xs">No Img</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{col.title}</div>
                                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{col.description}</div>
                                        <div className="text-[10px] text-gray-400 font-mono mt-1">/{col.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {col.tags?.map((tag: string) => (
                                                <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${col.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {col.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => handleEdit(col)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteMutation.mutate(col._id)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!collections || collections.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400 font-medium tracking-wide">
                                        No collections found. Create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
