'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params.category as string;

    // Format category nicely
    const categoryName = categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const { data: products, isLoading } = useQuery({
        queryKey: ['category', categorySlug],
        queryFn: async () => {
            const { data } = await api.get(`/products?category=${categorySlug}`);
            return data.products || data || [];
        }
    });

    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">{categoryName} Dresses</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-widest text-sm">
                        Curated selections from our {categoryName.toLowerCase()} collection.
                    </p>
                </div>

                {/* Sub-navigation back to main dresses page */}
                <div className="flex justify-center mb-12 border-b border-gray-100 pb-4">
                    <Link href="/dresses" className="text-sm font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to All Dresses
                    </Link>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        {isLoading ? 'Loading...' : `${products?.length || 0} Products`}
                    </span>
                    <select className="text-sm font-medium bg-transparent border border-gray-200 rounded px-3 py-1.5 focus:ring-black">
                        <option>Sort by: Recommended</option>
                        <option>Newest Arrivals</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
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
                        products?.map((product: any, idx: number) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group cursor-pointer"
                            >
                                <Link href={`/product/${product._id}`}>
                                    <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-lg bg-gray-50">
                                        <img
                                            src={product.images && product.images.length > 0 ? product.images[0].url : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="w-full bg-white/95 backdrop-blur text-black py-3 text-xs font-bold uppercase tracking-widest rounded shadow-xl hover:bg-black hover:text-white transition-colors">
                                                Quick Add
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1 mb-1">{product.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">₹{product.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>

                {!isLoading && products?.length === 0 && (
                    <div className="text-center py-24 text-gray-500">
                        <p className="mb-4">No dresses currently available in the {categoryName} category.</p>
                        <Link href="/dresses" className="text-black font-bold uppercase tracking-widest text-sm hover:underline">
                            Browse All Dresses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
