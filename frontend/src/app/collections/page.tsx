'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

interface Collection {
    _id: string;
    id?: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
}

export default function CollectionsIndexPage() {
    const { data: collectionsData, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            const { data } = await api.get('/collections');
            return data as Collection[];
        }
    });

    const collections = collectionsData || [];

    return (
        <div className="bg-[#fafaf9] min-h-screen">
            {/* ── Page Header ─────────────────────────────── */}
            <div className="bg-white border-b border-gray-100 py-16 text-center px-4">
                <p className="text-rose-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">Curated Capsules</p>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-4 tracking-tight">Our Collections</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
                    Discover exclusive capsules and seasonal edits, designed to redefine your aura and elevate your wardrobe.
                </p>
            </div>

            {/* ── Collections Grid ────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {isLoading ? (
                    <div className="flex flex-col gap-10">
                        <div className="h-64 bg-gray-100 animate-pulse w-full"></div>
                        <div className="h-64 bg-gray-100 animate-pulse w-full"></div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10 md:gap-16">
                        {collections.map((c, idx) => {
                            const isEven = idx % 2 === 0;
                            const linkPath = `/collections/${c.slug}`;

                            const resolveImage = (path: string | undefined): string => {
                                if (!path) return 'https://images.unsplash.com/photo-1515372039744-b0f02a3ae446?w=1600&q=80';
                                if (path.startsWith('http')) return path;
                                // Derive server base URL from axios config (http://localhost:5001/api -> http://localhost:5001)
                                // @ts-ignore
                                const serverBase = (api.defaults.baseURL || '').replace('/api', '') || 'http://localhost:5001';
                                return `${serverBase}/${path.startsWith('/') ? path.slice(1) : path}`;
                            };

                            return (
                                <motion.div
                                    key={c._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.8 }}
                                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 lg:gap-12 items-center group`}
                                >
                                    {/* Image Side */}
                                    <div className="w-full md:w-1/2 relative h-[400px] sm:h-[500px] overflow-hidden bg-gray-100 rounded-lg shadow-sm">
                                        <Link href={linkPath} className="absolute inset-0 z-20" aria-label={`View ${c.title}`} />
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={resolveImage(c.image)}
                                            alt={c.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515372039744-b0f02a3ae446?w=1600&q=80'; }}
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                                    </div>

                                    {/* Content Side */}
                                    <div className="w-full md:w-1/2 flex flex-col justify-center py-6 md:py-0 px-4 md:px-8">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {c.tags?.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white border border-gray-200 px-2 py-1">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors">
                                            {c.title}
                                        </h2>
                                        <p className="text-gray-500 leading-relaxed mb-8 max-w-md">
                                            {c.description}
                                        </p>

                                        <Link
                                            href={linkPath}
                                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-1 self-start hover:text-rose-600 hover:border-rose-600 transition-colors cursor-pointer z-30"
                                        >
                                            View The Edit
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {collections.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-lg">New collections coming soon.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
