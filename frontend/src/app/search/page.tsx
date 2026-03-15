'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const { data: results, isLoading } = useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            if (!query) return [];
            const { data } = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
            return data.products || data;
        },
        enabled: !!query
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="mb-12">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Search Results</h1>
                <p className="text-gray-500">
                    {isLoading ? 'Searching...' : `Found ${results?.length || 0} results for "${query}"`}
                </p>
            </div>

            {isLoading ? (
                <div className="min-h-[40vh] flex items-center justify-center text-gray-400">Loading results...</div>
            ) : results?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {results.map((product: any, idx: number) => (
                        <Link href={`/product/${product.slug || product.id || product._id}`} key={product.id || product._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group cursor-pointer h-full flex flex-col"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 rounded-lg mb-4">
                                    <img
                                        src={product.img || (product.images && product.images.length > 0 ? product.images[0].url : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80')}
                                        alt={product.title || product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                                        {product.title || product.name}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="text-rose-600 font-bold text-lg">₹{(product.price).toLocaleString()}</span>
                                        <span className="text-gray-400 line-through text-sm">₹{(product.originalPrice || (product.price * 1.4)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="min-h-[40vh] flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100 p-8 text-center">
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No dresses found</h3>
                    <p>Try searching for different keywords or browse our new arrivals.</p>
                    <Link href="/dresses" className="mt-6 bg-black text-white px-6 py-3 font-medium hover:bg-rose-600 transition-colors">
                        Browse Collection
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function SearchResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading search...</div>}>
            <SearchResults />
        </Suspense>
    );
}
