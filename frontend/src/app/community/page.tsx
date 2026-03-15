'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

// Mock Community Data (Point 141, 142, 145, 146, 147, 148, 150)
const communityLooks = [
    { id: 1, user: '@priya_style', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', img: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800&q=80', likes: 1240, desc: 'Wore the Emerald Drape to my best friend\'s wedding! Obsessed.' },
    { id: 2, user: '@kavya.trends', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80', likes: 892, desc: 'Cocktail night ready in the Ruby Mini 🍷' },
    { id: 3, user: '@anya_fashion', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', likes: 2150, desc: 'Midnight Silk for the gala. DressAura never misses.' }
];

const trendingDiscussions = [
    { topic: 'Summer 2026 Silk Trends', replies: 342, hot: true },
    { topic: 'Styling the Ruby Mini for Daytime', replies: 128, hot: false },
    { topic: 'Vote: Which color should they drop next?', replies: 890, hot: true }
];

export default function CommunityPage() {
    const [liked, setLiked] = useState<number[]>([]);

    const toggleLike = (id: number) => {
        setLiked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <span className="text-rose-600 font-bold tracking-widest text-xs uppercase mb-3 block">The Aura Collective</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Community Inspiration Board</h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">Real women, real confidence. Share your looks, vote on future drops, and discuss the latest trends.</p>
                <div className="mt-8 flex justify-center space-x-4">
                    <Button size="lg" className="bg-black hover:bg-gray-800">Upload Your Look</Button>
                    <Button size="lg" variant="outline">Join Discussion</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-serif font-bold">Style Feed</h2>
                        <div className="flex space-x-2">
                            <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">Top Rated</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">Recent</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {communityLooks.map((look) => (
                            <motion.div key={look.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="relative aspect-[4/5]">
                                    <Image src={look.img} alt="User Look" fill className="object-cover" />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-2">
                                            <img src={look.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                                            <span className="font-bold text-sm">{look.user}</span>
                                        </div>
                                        <button onClick={() => toggleLike(look.id)} className="flex items-center space-x-1 text-gray-400 hover:text-rose-600">
                                            <svg className={`w-5 h-5 ${liked.includes(look.id) ? 'fill-rose-600 text-rose-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                            <span className="text-xs font-bold">{look.likes + (liked.includes(look.id) ? 1 : 0)}</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600">{look.desc}</p>
                                    <button className="mt-4 w-full text-xs font-bold border border-gray-200 py-2 rounded uppercase tracking-wider hover:border-black transition-colors">Shop This Look</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-rose-50 rounded-xl p-6 border border-rose-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-rose-200 text-rose-700 p-1.5 rounded mr-2">🔥</span>
                            Trending Discussions
                        </h3>
                        <div className="space-y-4">
                            {trendingDiscussions.map((t, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:border-black border border-transparent transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-bold leading-tight flex-1">{t.topic}</h4>
                                        {t.hot && <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">HOT</span>}
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{t.replies} Replies</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black text-white rounded-xl p-6">
                        <h3 className="font-serif font-bold text-xl mb-2">Style Challenge: Gala Night</h3>
                        <p className="text-gray-400 text-sm mb-4">Submit your best evening wear look using any DressAura item. Winner gets an exclusive VIP pass for the next drop.</p>
                        <div className="w-full bg-white/20 h-1.5 rounded-full mb-2">
                            <div className="bg-yellow-400 w-3/4 h-full rounded-full" />
                        </div>
                        <span className="text-xs text-yellow-400 font-bold tracking-widest uppercase">Ends in 2 days</span>
                        <Button className="w-full mt-4 bg-white text-black hover:bg-gray-200">Submit Look</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
