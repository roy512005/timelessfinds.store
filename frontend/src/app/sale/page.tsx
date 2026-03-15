'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { ProductCard, type Product } from '@/components/ui/ProductCard';

export default function SalePage() {
    const [activeTab, setActiveTab] = useState('All Sale');
    
    const { data: rawProducts, isLoading } = useQuery({
        queryKey: ['sale-products'],
        queryFn: async () => {
            const { data } = await api.get('/products');
            return (data.products || data || []) as Product[];
        }
    });

    const products = (rawProducts || []).map((p: any, idx: number) => {
        // Use a varied mock factor for original price to create different discount tiers
        const mockFactor = idx % 3 === 0 ? 1.5 : (idx % 3 === 1 ? 1.25 : 2.0);
        const originalPrice = p.originalPrice || Math.round(p.price * mockFactor);
        const discount = Math.round((1 - (p.price / originalPrice)) * 100);
        return { ...p, originalPrice, discount };
    }).filter(p => p.discount >= 15); // Show anything with at least 15% off

    const filteredProducts = products.filter(p => {
        if (activeTab === 'All Sale') return true;
        if (activeTab === '20% OFF') return p.discount >= 20 && p.discount < 30;
        if (activeTab === '30% OFF') return p.discount >= 30 && p.discount < 50;
        if (activeTab === 'Clearance') return p.discount >= 50;
        return true;
    });

    return (
        <div className="bg-rose-50/30 min-h-screen pt-24 pb-16">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -z-10" />

                    <div className="inline-flex items-center justify-center space-x-2 bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Limited Time Offers</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 tracking-tight">The Archive Sale</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Uncover last-chance styles and seasonal favorites at exceptional prices. Once they&apos;re gone, they&apos;re gone forever.
                    </p>
                </div>

                {/* Sub-categories row */}
                <div className="flex justify-center gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
                    {['All Sale', '20% OFF', '30% OFF', 'Clearance'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors
                                ${activeTab === cat ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[2/3] bg-gray-100 mb-4 rounded-lg" />
                                <div className="h-4 bg-gray-200 w-2/3 mb-2 rounded" />
                                <div className="h-4 bg-gray-100 w-1/3 rounded" />
                            </div>
                        ))
                    ) : (
                        filteredProducts.map((p) => (
                            <ProductCard key={p._id} p={p} />
                        ))
                    )}
                </div>

                {!isLoading && filteredProducts.length === 0 && (
                    <div className="text-center py-24 text-gray-500 italic">
                        No items found matching your selection in the Archive.
                    </div>
                )}
            </div>
        </div>
    );
}
