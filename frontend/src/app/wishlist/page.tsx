'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
    const { items, removeItemLocally } = useWishlistStore();
    const { addItemLocally } = useCartStore();

    const handleMoveToCart = (item: any) => {
        addItemLocally({
            _id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            // Fallback for demo purposes if size/color wasn't saved to wishlist previously
            size: item.size || 'M',
        });
        removeItemLocally(item._id);
        toast.success(`${item.name} moved to bag!`);
    };

    return (
        <div className="bg-gray-50/50 min-h-[80vh] pt-24 pb-16">
            <div className="max-w-[1200px] mx-auto px-6">

                {/* Header */}
                <div className="mb-12 border-b border-gray-200 pb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Your Wishlist</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm flex items-center">
                        <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 font-bold">{items.length}</span>
                        Saved Items
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Save the pieces you love while you browse. They will be waiting for you right here.
                        </p>
                        <Link href="/dresses" className="inline-flex items-center justify-center bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors rounded">
                            Discover Dresses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {items.map((item, idx) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group flex flex-col bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative overflow-hidden"
                                >
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeItemLocally(item._id)}
                                        className="absolute top-6 right-6 z-20 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <Link href={`/product/${item._id}`} className="block relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-50 mb-4">
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </Link>

                                    <div className="flex flex-col flex-1">
                                        <Link href={`/product/${item._id}`}>
                                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1 mb-1">{item.name}</h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 font-medium mb-4">₹{item.price?.toLocaleString() || '-'}</p>

                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            className="mt-auto w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest rounded flex justify-center items-center hover:bg-rose-600 transition-colors"
                                        >
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Move to Bag
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
