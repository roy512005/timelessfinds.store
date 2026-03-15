'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ProductCard, ProductCardSkeleton, type Product } from '@/components/ui/ProductCard';

function DressesContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category');
    const initialGender = searchParams.get('gender');
    
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeGender, setActiveGender] = useState<string | null>(null);

    const { data: rawCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('/categories');
            return (data || []) as Array<{ _id: string; name: string; slug?: string }>;
        },
    });
    
    useEffect(() => {
        if (initialGender) {
            setActiveGender(initialGender);
        }
        if (initialCategory) {
            // Decode URL-encoded category e.g. "Suit+Sets" -> "Suit Sets"
            const decoded = decodeURIComponent(initialCategory.replace(/\+/g, ' '));
            if (rawCategories) {
                // Try exact match first, then case-insensitive
                const found = rawCategories.find(c => 
                    c.name === decoded ||
                    c.name.toLowerCase() === decoded.toLowerCase() ||
                    c.slug === decoded
                );
                setActiveCategory(found ? found.name : decoded);
            } else {
                // rawCategories not loaded yet — set the decoded value; will correct when categories load
                setActiveCategory(decoded);
            }
        }
    }, [initialCategory, initialGender, rawCategories]);

    const [sort, setSort] = useState('top');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 25000 });

    const SORT_OPTIONS = [
        { value: 'top', label: 'Top Rated' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest' },
    ];

    const { data: filterData } = useQuery({
        queryKey: ['product-filters'],
        queryFn: async () => {
            const { data } = await api.get('/products/filters');
            return data;
        }
    });

    const SIZES: string[] = filterData?.sizes || [];
    const COLORS: string[] = filterData?.colors || [];


    const categoryTabs = ['All', ...(rawCategories || []).map((c) => c.name)];

    const { data: dbData, isLoading } = useQuery({
        queryKey: ['products', activeCategory, activeGender, selectedSizes, selectedColors, debouncedSearch, priceRange],
        queryFn: async () => {
            let url = '/products?';
            if (activeCategory !== 'All') url += `category=${encodeURIComponent(activeCategory)}&`;
            if (activeGender) url += `gender=${activeGender}&`;
            if (debouncedSearch) url += `keyword=${encodeURIComponent(debouncedSearch)}&`;
            if (priceRange.min > 0) url += `minPrice=${priceRange.min}&`;
            if (priceRange.max < 25000) url += `maxPrice=${priceRange.max}&`;
            if (selectedSizes.length > 0) url += `size=${selectedSizes.join(',')}&`;
            if (selectedColors.length > 0) url += `color=${selectedColors.join(',')}&`;
            
            const { data } = await api.get(url);
            return (data.products || data || []) as Product[];
        },
    });

    const base: Product[] = dbData || [];
    let filtered = base;

    // Sort
    filtered = [...filtered].sort((a: any, b: any) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'top') return (b.rating ?? 0) - (a.rating ?? 0);
        if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
    });

    const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

    return (
        <div className="bg-white min-h-screen">
            {/* Page Header */}
            <div className="bg-[#fafaf9] border-b border-gray-100 py-14 text-center px-4">
                <p className="text-rose-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">The Full Edit</p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3">All Dresses</h1>
                <p className="text-gray-500 text-sm max-w-xl mx-auto">
                    Handpicked dresses for every occasion — from cocktail parties to red carpets.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* ── Toolbar ───────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-800 hover:text-rose-600 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                            {filterOpen ? 'Hide Filters' : 'Filters'}
                            {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                                <span className="bg-rose-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {selectedSizes.length + selectedColors.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2 flex-1 justify-center">
                        {categoryTabs.map((cat: string) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors bg-white w-32 md:w-48"
                            />
                        </div>

                        {/* Sort */}
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

                <div className="flex flex-col md:flex-row gap-10">
                    {/* ── Filters Sidebar ───────────────────── */}
                    {filterOpen && (
                        <aside className="w-full md:w-52 shrink-0">
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

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-100">Price Range</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>₹{priceRange.min}</span>
                                            <span>₹{priceRange.max === 25000 ? '25,000+' : priceRange.max}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="25000"
                                            step="500"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                            className="w-full accent-black h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex gap-2">
                                            {[1000, 5000, 10000, 15000].map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setPriceRange({ min: 0, max: p })}
                                                    className={`flex-1 py-1.5 border text-[10px] font-bold uppercase tracking-widest transition-all ${priceRange.max === p ? 'bg-black text-white border-black' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                                >
                                                    Under {p/1000}k
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-100">Color</h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {COLORS.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => toggleColor(c)}
                                                className={`w-7 h-7 rounded-full border-2 hover:border-black transition-all shadow-sm ${selectedColors.includes(c) ? 'border-black ring-2 ring-offset-1 ring-gray-300' : 'border-gray-200'}`}
                                                style={{ backgroundColor: c }}
                                                aria-label={`Color ${c}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Clear */}
                                {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                                    <button
                                        onClick={() => { setSelectedSizes([]); setSelectedColors([]); }}
                                        className="text-xs text-rose-600 font-bold uppercase tracking-widest"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        </aside>
                    )}

                    {/* ── Grid ──────────────────────────────────── */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className={`grid grid-cols-2 gap-x-5 gap-y-12 ${filterOpen ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
                                {[...Array(8)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-24 text-gray-400">
                                <p className="text-4xl mb-4">🔍</p>
                                <p className="text-lg font-medium">No dresses found</p>
                                <p className="text-sm mt-1">Try relaxing your filters or search.</p>
                            </div>
                        ) : (
                            <div className={`grid grid-cols-2 gap-x-5 gap-y-12 ${filterOpen ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
                                {filtered.map((p) => (
                                    <ProductCard key={p.id || p._id} p={p} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DressesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <DressesContent />
        </Suspense>
    );
}
