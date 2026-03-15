'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ProductCard, type Product } from '@/components/ui/ProductCard';
import { Filter } from 'lucide-react';



const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
];

export default function NewArrivalsPage() {
    const [sort, setSort] = useState('newest');
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    const { data: filterData } = useQuery({
        queryKey: ['product-filters'],
        queryFn: async () => {
            const { data } = await api.get('/products/filters');
            return data;
        }
    });

    const SIZES: string[] = filterData?.sizes || [];
    const COLORS: string[] = filterData?.colors || [];

    const { data: dbData, isLoading } = useQuery({
        queryKey: ['new-arrivals', sort, selectedSizes, selectedColors],
        queryFn: async () => {
            const { data } = await api.get('/products', { params: { sort, limit: 120 } });
            const items = (data.products || data || []) as Product[];

            const grouped: Record<string, any[]> = {};
            items.forEach((p: any) => {
                const cat = p.category || 'other';
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(p);
            });
            const mixed: any[] = [];
            const keys = Object.keys(grouped);
            let i = 0;
            while (mixed.length < items.length && keys.length > 0) {
                const key = keys[i % keys.length];
                if (grouped[key].length > 0) mixed.push(grouped[key].shift());
                else keys.splice(i % keys.length, 1);
                if (grouped[key]?.length > 0) i++;
            }
            let arr = mixed.length > 0 ? mixed : items;

            if (selectedSizes.length > 0) {
                arr = arr.filter((p: any) => p.sizes?.some((s: any) => selectedSizes.includes(typeof s === 'string' ? s : s.size)));
            }
            if (selectedColors.length > 0) {
                arr = arr.filter((p: any) => p.colors?.some((c: any) => selectedColors.includes(typeof c === 'string' ? c : c.hexCode)));
            }

            return arr;
        },
    });

    const products: Product[] = dbData || [];

    const toggleSize = (s: string) =>
        setSelectedSizes((prev) =>
            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
        );

    const toggleColor = (c: string) =>
        setSelectedColors((prev) =>
            prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
        );

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-[#fafaf9] border-b border-gray-100 py-14 text-center px-4">
                <p className="text-rose-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">Just Dropped</p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3">New Arrivals</h1>
                <p className="text-gray-500 text-sm max-w-xl mx-auto">
                    Fresh styles added every week. Be the first to wear the next big thing.
                </p>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* ── Toolbar ───────────────────────────────── */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-800 hover:text-rose-600 transition-colors"
                    >
                        <Filter size={14} />
                        {filterOpen ? 'Hide Filters' : 'Filters'}
                        {selectedSizes.length > 0 && (
                            <span className="bg-rose-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {selectedSizes.length}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400 hidden sm:block">{products.length} new styles</span>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="text-xs font-bold uppercase tracking-widest border border-gray-200 px-3 py-2 focus:outline-none focus:border-black bg-white"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-10">
                    {/* ── Filters Sidebar ───────────────────── */}
                    {filterOpen && (
                        <aside className="hidden md:block w-52 shrink-0">
                            <div className="sticky top-28 space-y-8">
                                {/* Size */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-100">Size</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {SIZES.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => toggleSize(s)}
                                                className={`w-10 h-10 text-xs font-bold border transition-all ${selectedSizes.includes(s)
                                                    ? 'bg-black text-white border-black'
                                                    : 'border-gray-200 text-gray-600 hover:border-black'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-100">Color</h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {COLORS.map((c) => (
                                            <button
                                                key={c}
                                                className="w-7 h-7 rounded-full border-2 border-gray-200 hover:border-gray-500 transition-all shadow-sm"
                                                style={{ backgroundColor: c }}
                                                aria-label={`Color ${c}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Price */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-100">Price Range</h3>
                                    <div className="space-y-2">
                                        {['Under ₹2,000', '₹2,000 – ₹5,000', '₹5,000 – ₹10,000', 'Above ₹10,000'].map((r) => (
                                            <label key={r} className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="w-3.5 h-3.5 accent-black" />
                                                <span className="text-xs text-gray-600">{r}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Clear */}
                                {selectedSizes.length > 0 && (
                                    <button
                                        onClick={() => setSelectedSizes([])}
                                        className="text-xs text-rose-600 font-bold uppercase tracking-widest"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </aside>
                    )}

                    {/* ── Product Grid ──────────────────────── */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[3/4] bg-gray-100 mb-3" />
                                        <div className="h-3 bg-gray-100 w-2/3 mb-2 rounded" />
                                        <div className="h-3 bg-gray-100 w-1/3 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`grid grid-cols-2 gap-x-5 gap-y-12 ${filterOpen ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
                                {products.map((p) => (
                                    <ProductCard key={p.id || p._id} p={p} />
                                ))}
                            </div>
                        )}

                        {!isLoading && products.length === 0 && (
                            <div className="text-center py-24 text-gray-400">
                                <p className="text-4xl mb-4">✨</p>
                                <p className="text-lg font-medium">More arrivals coming soon!</p>
                                <p className="text-sm mt-1">Check back shortly for new styles.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
