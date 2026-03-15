'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function HomepageManager() {
    const queryClient = useQueryClient();

    // ─── 1. Fetching Data ────────────────────────────────────────────────
    const { data: heroData, isLoading: heroLoading } = useQuery({
        queryKey: ['admin-herobanners'],
        queryFn: async () => {
            const { data } = await api.get('/v1/herobanners');
            return data?.items?.[0] || {};
        }
    });

    const { data: promoData, isLoading: promoLoading } = useQuery({
        queryKey: ['admin-promosections'],
        queryFn: async () => {
            const { data } = await api.get('/v1/promosections');
            return data?.items?.[0] || {};
        }
    });

    const { data: creatorData, isLoading: creatorLoading } = useQuery({
        queryKey: ['admin-creators'],
        queryFn: async () => {
            const { data } = await api.get('/v1/creators');
            return data?.items?.[0] || {};
        }
    });

    const { data: instagramPosts = [], isLoading: instaLoading } = useQuery({
        queryKey: ['admin-instagramposts'],
        queryFn: async () => {
            const { data } = await api.get('/v1/instagramposts');
            return data?.items || [];
        }
    });

    const { data: tickerItems = [], isLoading: tickerLoading } = useQuery({
        queryKey: ['admin-top-banners'],
        queryFn: async () => {
            const { data } = await api.get('/home/top-banners');
            return data;
        }
    });

    // ─── Local States for Editing ───────────────────────────────────────
    const [heroForm, setHeroForm] = useState(null as any);
    const [promoForm, setPromoForm] = useState(null as any);
    const [creatorForm, setCreatorForm] = useState(null as any);
    const [newInsta, setNewInsta] = useState({ image_url: '', handle: '', likes: '' });
    const [newTicker, setNewTicker] = useState('');

    // Auto-hydrating forms
    if (heroData && !heroForm && !heroLoading) setHeroForm({ ...heroData });
    if (promoData && !promoForm && !promoLoading) setPromoForm({ ...promoData });
    if (creatorData && !creatorForm && !creatorLoading) setCreatorForm({ ...creatorData });

    // ─── 2. Mutations ───────────────────────────────────────────────────
    // Update Hero
    const updateHero = useMutation({
        mutationFn: async (payload: any) => {
            if (payload._id) return await api.put(`/v1/herobanners/${payload._id}`, payload);
            return await api.post('/v1/herobanners', payload); // Fallback if none exists
        },
        onSuccess: () => {
            toast.success('Hero Banner saved successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-herobanners'] });
        },
        onError: () => toast.error('Failed to update Hero Banner')
    });

    // Update Promo
    const updatePromo = useMutation({
        mutationFn: async (payload: any) => {
            if (payload._id) return await api.put(`/v1/promosections/${payload._id}`, payload);
            return await api.post('/v1/promosections', payload);
        },
        onSuccess: () => {
            toast.success('Promo Section saved successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-promosections'] });
        },
        onError: () => toast.error('Failed to update Promo Section')
    });

    // Update Creator
    const updateCreator = useMutation({
        mutationFn: async (payload: any) => {
            if (payload._id) return await api.put(`/v1/creators/${payload._id}`, payload);
            return await api.post('/v1/creators', payload);
        },
        onSuccess: () => {
            toast.success('Creator Collab saved successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-creators'] });
        },
        onError: () => toast.error('Failed to update Creator Collab')
    });

    // Delete Instagram Post
    const deleteInsta = useMutation({
        mutationFn: async (id: string) => await api.delete(`/v1/instagramposts/${id}`),
        onSuccess: () => {
            toast.success('Instagram Post removed');
            queryClient.invalidateQueries({ queryKey: ['admin-instagramposts'] });
        }
    });

    // Add Instagram Post
    const addInsta = useMutation({
        mutationFn: async (payload: any) => await api.post('/v1/instagramposts', payload),
        onSuccess: () => {
            toast.success('Instagram Post added');
            setNewInsta({ image_url: '', handle: '', likes: '' });
            queryClient.invalidateQueries({ queryKey: ['admin-instagramposts'] });
        }
    });

    // Add Ticker
    const addTicker = useMutation({
        mutationFn: async (text: string) => await api.post('/home/top-banners', { text }),
        onSuccess: () => {
            toast.success('Ticker item added');
            setNewTicker('');
            queryClient.invalidateQueries({ queryKey: ['admin-top-banners'] });
        },
        onError: () => toast.error('Failed to add ticker item')
    });

    // Delete Ticker
    const deleteTicker = useMutation({
        mutationFn: async (id: string) => await api.delete(`/home/top-banners/${id}`),
        onSuccess: () => {
            toast.success('Ticker item removed');
            queryClient.invalidateQueries({ queryKey: ['admin-top-banners'] });
        }
    });

    if (heroLoading || promoLoading || creatorLoading) return <div className="p-10 font-serif">Loading CMS...</div>;

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Homepage CMS</h1>
                <p className="text-gray-500 mt-1">Manage all the dynamic content displayed on the frontend homepage.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ─── Hero Banner Settings ────────────────────────── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Hero Banner</h2>
                        <button
                            onClick={() => updateHero.mutate(heroForm)}
                            className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded transition-colors hover:bg-gray-800"
                        >
                            {updateHero.isPending ? 'Saving...' : 'Save Hero'}
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="relative w-full h-32 bg-gray-100 rounded border border-gray-300 overflow-hidden">
                            {heroForm?.image && <img src={heroForm.image} alt="Hero" className="object-cover w-full h-full opacity-70" />}
                        </div>

                        <input type="text" placeholder="Image URL" value={heroForm?.image || ''} onChange={e => setHeroForm({ ...heroForm, image: e.target.value })} className="w-full text-sm border p-2 rounded" />
                        <input type="text" placeholder="Title (e.g., Own\nThe Room)" value={heroForm?.title || ''} onChange={e => setHeroForm({ ...heroForm, title: e.target.value })} className="w-full text-sm border p-2 rounded" />
                        <input type="text" placeholder="Subtitle" value={heroForm?.subtitle || ''} onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })} className="w-full text-sm border p-2 rounded" />
                        <textarea placeholder="Description" value={heroForm?.description || ''} onChange={e => setHeroForm({ ...heroForm, description: e.target.value })} className="w-full text-sm border p-2 rounded h-20" />

                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Btn 1 Text" value={heroForm?.button1_text || ''} onChange={e => setHeroForm({ ...heroForm, button1_text: e.target.value })} className="text-sm border p-2 rounded" />
                            <input type="text" placeholder="Btn 1 Link" value={heroForm?.button1_link || ''} onChange={e => setHeroForm({ ...heroForm, button1_link: e.target.value })} className="text-sm border p-2 rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Btn 2 Text" value={heroForm?.button2_text || ''} onChange={e => setHeroForm({ ...heroForm, button2_text: e.target.value })} className="text-sm border p-2 rounded" />
                            <input type="text" placeholder="Btn 2 Link" value={heroForm?.button2_link || ''} onChange={e => setHeroForm({ ...heroForm, button2_link: e.target.value })} className="text-sm border p-2 rounded" />
                        </div>
                    </div>
                </div>


                {/* ─── Promo Section Settings ────────────────────────── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Promo Section</h2>
                        <button
                            onClick={() => updatePromo.mutate(promoForm)}
                            className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded transition-colors hover:bg-gray-800"
                        >
                            {updatePromo.isPending ? 'Saving...' : 'Save Promo'}
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="relative w-full h-32 bg-gray-100 rounded border border-gray-300 overflow-hidden">
                            {promoForm?.image && <img src={promoForm.image} alt="Promo" className="object-cover w-full h-full opacity-70" />}
                        </div>

                        <input type="text" placeholder="Promo Image URL" value={promoForm?.image || ''} onChange={e => setPromoForm({ ...promoForm, image: e.target.value })} className="w-full text-sm border p-2 rounded" />
                        <input type="text" placeholder="Title (e.g. Midnight Gala)" value={promoForm?.title || ''} onChange={e => setPromoForm({ ...promoForm, title: e.target.value })} className="w-full text-sm border p-2 rounded" />
                        <input type="text" placeholder="Badge text (e.g. Limited Collection)" value={promoForm?.badge || ''} onChange={e => setPromoForm({ ...promoForm, badge: e.target.value })} className="w-full text-sm border p-2 rounded" />
                        <textarea placeholder="Description" value={promoForm?.description || ''} onChange={e => setPromoForm({ ...promoForm, description: e.target.value })} className="w-full text-sm border p-2 rounded h-24" />

                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Pieces Left (e.g. 50)" value={promoForm?.pieces_left || ''} onChange={e => setPromoForm({ ...promoForm, pieces_left: e.target.value })} className="text-sm border p-2 rounded" />
                            <input type="text" placeholder="Time Left (e.g. 48h)" value={promoForm?.time_left || ''} onChange={e => setPromoForm({ ...promoForm, time_left: e.target.value })} className="text-sm border p-2 rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="CTA Text" value={promoForm?.cta_text || ''} onChange={e => setPromoForm({ ...promoForm, cta_text: e.target.value })} className="text-sm border p-2 rounded" />
                            <input type="text" placeholder="CTA Link" value={promoForm?.cta_link || ''} onChange={e => setPromoForm({ ...promoForm, cta_link: e.target.value })} className="text-sm border p-2 rounded" />
                        </div>
                    </div>
                </div>

                {/* ─── Creator Collab Settings ────────────────────────── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Creator Collab</h2>
                        <button
                            onClick={() => updateCreator.mutate(creatorForm)}
                            className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded transition-colors hover:bg-gray-800"
                        >
                            {updateCreator.isPending ? 'Saving...' : 'Save Creator'}
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="relative w-full aspect-[4/5] bg-gray-100 rounded border border-gray-300 overflow-hidden md:w-48 mx-auto">
                                {creatorForm?.image && <img src={creatorForm.image} alt="Creator" className="object-cover w-full h-full opacity-70" />}
                            </div>
                            <input type="text" placeholder="Creator Image URL" value={creatorForm?.image || ''} onChange={e => setCreatorForm({ ...creatorForm, image: e.target.value })} className="w-full text-sm border p-2 rounded" />
                        </div>
                        <div className="space-y-4">
                            <input type="text" placeholder="Creator Name" value={creatorForm?.name || ''} onChange={e => setCreatorForm({ ...creatorForm, name: e.target.value })} className="w-full text-sm border p-2 rounded" />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="Handle (e.g. @priya)" value={creatorForm?.handle || ''} onChange={e => setCreatorForm({ ...creatorForm, handle: e.target.value })} className="text-sm border p-2 rounded" />
                                <input type="text" placeholder="Followers (e.g. 2.1M)" value={creatorForm?.followers || ''} onChange={e => setCreatorForm({ ...creatorForm, followers: e.target.value })} className="text-sm border p-2 rounded" />
                            </div>
                            <textarea placeholder="Collab Description" value={creatorForm?.description || ''} onChange={e => setCreatorForm({ ...creatorForm, description: e.target.value })} className="w-full text-sm border p-2 rounded h-20" />

                            <div className="grid grid-cols-2 gap-2">
                                <input type="number" placeholder="Pieces Total" value={creatorForm?.pieces_total || ''} onChange={e => setCreatorForm({ ...creatorForm, pieces_total: Number(e.target.value) })} className="text-sm border p-2 rounded" />
                                <input type="number" placeholder="Pieces Remaining" value={creatorForm?.pieces_remaining || ''} onChange={e => setCreatorForm({ ...creatorForm, pieces_remaining: Number(e.target.value) })} className="text-sm border p-2 rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="CTA Text" value={creatorForm?.cta_text || ''} onChange={e => setCreatorForm({ ...creatorForm, cta_text: e.target.value })} className="text-sm border p-2 rounded" />
                                <input type="text" placeholder="CTA Link" value={creatorForm?.cta_link || ''} onChange={e => setCreatorForm({ ...creatorForm, cta_link: e.target.value })} className="text-sm border p-2 rounded" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Instagram ────────────────────────────────────── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Instagram Feed Map</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                            {instagramPosts.map((post: any) => (
                                <div key={post._id} className="relative aspect-square group rounded overflow-hidden">
                                    <img src={post.image_url} alt={post.handle} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                        <span className="text-white text-[10px] break-all mb-2">{post.handle}</span>
                                        <button onClick={() => deleteInsta.mutate(post._id)} className="text-white text-xs bg-red-600 px-2 py-1 rounded">Delete</button>
                                    </div>
                                </div>
                            ))}
                            {/* Empty state filler blocks */}
                            {Array.from({ length: Math.max(0, 6 - instagramPosts.length) }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
                                    <span className="text-xs">+</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 border-t border-gray-200 p-4">
                        <h3 className="font-bold text-gray-900 text-xs uppercase mb-3">Add New Post</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input type="text" placeholder="Image URL" value={newInsta.image_url} onChange={e => setNewInsta({ ...newInsta, image_url: e.target.value })} className="text-sm border p-2 rounded col-span-2 md:col-span-1" />
                            <input type="text" placeholder="@handle" value={newInsta.handle} onChange={e => setNewInsta({ ...newInsta, handle: e.target.value })} className="text-sm border p-2 rounded" />
                            <input type="text" placeholder="Likes (e.g. 12.4k)" value={newInsta.likes} onChange={e => setNewInsta({ ...newInsta, likes: e.target.value })} className="text-sm border p-2 rounded" />
                            <button onClick={() => addInsta.mutate(newInsta)} disabled={!newInsta.image_url || !newInsta.handle} className="bg-black text-white text-xs font-bold uppercase disabled:opacity-50">
                                Add Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Ticker / Top Banner ───────────────────────── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
                    <div className="bg-gray-900 border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 className="font-bold text-white uppercase tracking-widest text-sm">Top Header Ticker Bar</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-xs text-gray-500 mb-4">These items scroll across the black bar at the top of the homepage. E.g. &quot;Free Shipping Over ₹999&quot;, &quot;New Arrivals Weekly&quot;</p>
                        
                        {/* Existing items */}
                        <div className="space-y-2 mb-6">
                            {tickerItems.map((item: any) => (
                                <div key={item._id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-lg">✦</span>
                                        <span className="text-sm font-medium text-gray-800">{item.text}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteTicker.mutate(item._id)}
                                        className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {tickerItems.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-4">No ticker items yet. Default text will be shown.</p>
                            )}
                        </div>

                        {/* Add new */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. Free Shipping Over ₹999"
                                value={newTicker}
                                onChange={e => setNewTicker(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && newTicker.trim()) addTicker.mutate(newTicker.trim()); }}
                                className="flex-1 text-sm border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <button
                                onClick={() => { if (newTicker.trim()) addTicker.mutate(newTicker.trim()); }}
                                disabled={!newTicker.trim() || addTicker.isPending}
                                className="bg-black text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {addTicker.isPending ? 'Adding...' : '+ Add'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
