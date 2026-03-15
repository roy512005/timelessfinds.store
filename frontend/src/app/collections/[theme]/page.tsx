'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductCard, type Product } from '@/components/ui/ProductCard';

export default function CollectionPage() {
    const params = useParams();
    const themeSlug = params.theme as string;

    const { data: collectionConfig, isLoading: isLoadingCollection } = useQuery({
        queryKey: ['collection-config', themeSlug],
        queryFn: async () => {
            const { data } = await api.get(`/collections/${themeSlug}`);
            return data;
        },
        retry: false
    });

    const { data: dbData, isLoading: isLoadingProducts } = useQuery({
        queryKey: ['collection-products', themeSlug, collectionConfig?.tags],
        queryFn: async () => {
            const tags = collectionConfig?.tags || [];
            if (tags.length === 0) {
                const keyword = collectionConfig?.title || themeSlug;
                const { data } = await api.get(`/products?keyword=${keyword}`);
                return (data.products || data || []) as Product[];
            }
            // Fetch products for each tag and merge, or just use the first tag
            const { data } = await api.get(`/products?tag=${tags[0]}`);
            return (data.products || data || []) as Product[];
        },
        enabled: !!collectionConfig
    });

    const isLoading = isLoadingCollection || isLoadingProducts;
    const products: Product[] = dbData || [];

    // Fallback if not found (or while loading)
    const displayConfig = collectionConfig || {
        title: `${themeSlug.charAt(0).toUpperCase() + themeSlug.slice(1)} Collection`,
        description: 'Curated styles handpicked for this exclusive collection.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    };

    return (
        <div className="bg-white min-h-screen">
            {/* ── Hero Section ────────────────────────────── */}
            <div className="relative h-[65vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    src={displayConfig.image || displayConfig.heroImage}
                    alt={displayConfig.title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                />

                <div className="relative z-20 text-center px-6 max-w-4xl pt-16 mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <h4 className="text-white/80 font-bold text-xs uppercase tracking-[0.3em] mb-4">
                            Curated Edit
                        </h4>
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 drop-shadow-xl leading-tight">
                            {displayConfig.title}
                        </h1>
                        <p className="text-white/95 text-lg font-medium max-w-2xl mx-auto drop-shadow-md">
                            {displayConfig.description}
                        </p>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Discover</span>
                    <div className="w-px h-8 bg-white/30 relative overflow-hidden">
                        <div className="absolute top-0 w-full h-[40%] bg-white animate-[scrollLine_1.5s_ease-in-out_infinite]" />
                    </div>
                </div>
            </div>

            {/* ── Product Grid ────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-5 gap-4">
                    <p className="text-gray-900 font-serif font-bold text-2xl">The Pieces</p>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-sm">
                        {isLoading ? 'Curating...' : `${products.length} Styles`}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-gray-100 mb-4 rounded-sm" />
                                <div className="h-3 bg-gray-100 w-3/4 mb-3 rounded-sm" />
                                <div className="h-3 bg-gray-100 w-1/3 rounded-sm" />
                            </div>
                        ))
                    ) : (
                        products.map((p) => (
                            <ProductCard key={p.id || p._id} p={p} />
                        ))
                    )}
                </div>

                {/* Empty State */}
                {!isLoading && products.length === 0 && (
                    <div className="text-center py-24 text-gray-500">
                        <p className="text-4xl mb-4">✨</p>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">The vault is currently closed.</h3>
                        <p className="max-w-md mx-auto text-sm leading-relaxed">
                            We are currently designing and curating pieces for this collection. Please check back later.
                        </p>
                        <Link
                            href="/dresses"
                            className="inline-block mt-8 bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors"
                        >
                            Explore All Dresses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
