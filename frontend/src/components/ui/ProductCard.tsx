'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import api from '@/lib/axios';


export interface Product {
    id: number | string;
    _id?: string;
    title?: string;
    name?: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviews?: number;
    numReviews?: number;
    badge?: string;
    img?: string;
    image?: string;
    images?: string[] | { url: string }[];
    stock?: number;
}

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width={size} height={size} viewBox="0 0 20 20"
                    fill={s <= Math.round(rating) ? '#D4AF37' : '#e5e7eb'}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export function ProductCard({ p }: { p: Product }) {
    const [hovered, setHovered] = useState(false);
    const [added, setAdded] = useState(false);

    const { addItemLocally, items: cartItems } = useCartStore();
    const { addItemLocally: addToWishlist, removeItemLocally: removeFromWishlist, items: wishlistItems } = useWishlistStore();

    const productId = String(p._id || p.id);
    const isInWishlist = wishlistItems.some(i => i._id === productId);
    const isInCart = cartItems.some(i => {
        const i_pid = i.product_variant_id && typeof i.product_variant_id === 'object' ? i.product_variant_id._id : i.product_variant_id;
        return (i._id === productId) || (i_pid === productId);
    });
    const title = p.title || p.name || '';
    const originalPrice = p.price || 0;
    const price = (p as any).discountPrice || p.price || 0;
    const disc = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const rating = p.rating ?? 4.7;
    const reviews = p.reviews ?? p.numReviews ?? Math.floor(Math.random() * 400 + 100);


    // Resolve image from multiple possible shapes
    const resolveImg = (): string => {
        const getUrl = () => {
            if (p.img) return p.img;
            if (p.image) return p.image;
            if (Array.isArray(p.images) && p.images.length > 0) {
                const first = p.images[0];
                if (typeof first === 'string') return first;
                if (first && typeof first === 'object' && 'url' in first) return first.url;
            }
            return null;
        };

        const raw = getUrl();
        if (!raw) return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80';
        if (raw.startsWith('http')) return raw;

        // Prepend server base URL if relative
        // @ts-ignore
        const serverBase = (api.defaults.baseURL || '').replace('/api', '') || 'http://localhost:5001';
        return `${serverBase}/${raw.startsWith('/') ? raw.slice(1) : raw}`;
    };

    function handleCart(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (isInCart) {
            // Find the item in cart to get its ID (might be cartItemId from backend)
            const itemInCart = cartItems.find(i => {
                const i_pid = i.product_variant_id && typeof i.product_variant_id === 'object' ? i.product_variant_id._id : i.product_variant_id;
                return (i._id === productId) || (i_pid === productId);
            });
            if (itemInCart) {
                // Use the cartItemId if available for backend sync, otherwise _id
                const idToRemove = itemInCart.cartItemId || itemInCart._id;
                const { useCartStore } = require('@/store/cartStore');
                useCartStore.getState().removeItemLocally(idToRemove);
            }
        } else {
            addItemLocally({
                _id: productId,
                name: title,
                price: price,
                originalPrice,
                image: resolveImg(),
                quantity: 1,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2200);
        }
    }
    function handleWishlist(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist) {
            removeFromWishlist(productId);
        } else {
            addToWishlist({
                _id: productId,
                name: title,
                price: p.price,
                originalPrice,
                image: resolveImg(),
            });
        }
    }



    const slug = p._id || p.id;

    return (
        <Link href={`/product/${slug}`}>
            <div
                className="group relative flex flex-col bg-white cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* ── Image ─────────────────────────────── */}
                <div className="relative overflow-hidden aspect-[3/4] bg-[#f7f5f3]">
                    {/* Badge */}
                    {p.badge && (
                        <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                            {p.badge}
                        </span>
                    )}
                    {/* Stock warning */}
                    {p.stock !== undefined && p.stock > 0 && p.stock <= 5 && (
                        <span className="absolute bottom-14 left-3 z-10 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 animate-pulse">
                            Only {p.stock} left
                        </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlist}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors group/wish"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isInWishlist ? '#e11d48' : 'none'}
                            stroke={isInWishlist ? '#e11d48' : 'currentColor'} strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>


                    {/* Product image */}
                    {p.images && Array.isArray(p.images) && p.images.length > 1 ? (
                        <>
                            <img
                                src={resolveImg()}
                                alt={title}
                                loading="lazy"
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
                                onError={(e) => { 
                                    const target = e.target as HTMLImageElement;
                                    const fallback = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80';
                                    if (target.src !== fallback) target.src = fallback;
                                }}
                            />
                            <img
                                src={
                                    typeof p.images[1] === 'string' 
                                        ? p.images[1] 
                                        : (p.images[1] as any).url || resolveImg()
                                }
                                alt={title}
                                loading="lazy"
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                            />
                        </>
                    ) : (
                        <img
                            src={resolveImg()}
                            alt={title}
                            loading="lazy"
                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
                            onError={(e) => { 
                                const target = e.target as HTMLImageElement;
                                const fallback = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80';
                                if (target.src !== fallback) target.src = fallback;
                             }}
                        />
                    )}

                    {/* Add to Cart sliding overlay */}
                    <div
                        className={`absolute bottom-0 inset-x-0 transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                    >
                        <button
                            id={`cart-${productId}`}
                            onClick={handleCart}
                            className={`w-full text-[11px] font-bold uppercase tracking-widest py-3.5 transition-colors ${isInCart ? 'bg-rose-600 text-white' : 'bg-black text-white hover:bg-rose-700'}`}
                        >
                            {added ? '✓ Added' : (isInCart ? 'In Bag' : 'Add to Cart')}
                        </button>
                    </div>
                </div>

                {/* ── Info ──────────────────────────────── */}
                <div className="pt-3 pb-1 flex flex-col gap-1">
                    <StarRating rating={rating} />
                    <h3 className="text-sm font-medium text-gray-900 mt-1 leading-snug line-clamp-1">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">₹{price.toLocaleString()}</span>
                        {originalPrice > price && (
                            <>
                                <span className="text-gray-400 line-through text-xs">₹{originalPrice.toLocaleString()}</span>
                                <span className="text-emerald-600 text-xs font-semibold">{disc}% off</span>
                            </>
                        )}
                    </div>
                    <p className="text-[11px] text-gray-400">{reviews} reviews</p>
                </div>
            </div>
        </Link>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col bg-white animate-pulse">
            <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
            <div className="pt-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-5 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
        </div>
    );
}
