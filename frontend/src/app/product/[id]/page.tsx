'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { addItemLocally: addToCart } = useCartStore();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [viewers, setViewers] = useState(14);
    const [showToast, setShowToast] = useState(false);

    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const [mainImage, setMainImage] = useState<string>('');

    const { data: dbData, isLoading } = useQuery({
        queryKey: ['product', params.id],
        queryFn: async () => {
            const { data } = await api.get(`/products/${params.id}`);
            return data;
        }
    });

    // Helper to resolve backend vs remote image
    const resolveImageUrl = (raw: any): string => {
        if (!raw) return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80';
        const url = typeof raw === 'string' ? raw : raw.url;
        if (!url) return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80';
        if (url.startsWith('http')) return url;
        
        // Derive server base URL from axios config
        // @ts-ignore
        const serverBase = (api.defaults.baseURL || '').replace('/api', '') || 'http://localhost:5001';
        return `${serverBase}/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    // Set initial main image when data loads
    useEffect(() => {
        if (dbData) {
            const firstImgRaw = (dbData.images && dbData.images.length > 0) ? dbData.images[0] : (dbData.img || dbData.image);
            setMainImage(resolveImageUrl(firstImgRaw));
        }
    }, [dbData]);

    const { data: reviewsData } = useQuery({
        queryKey: ['reviews', params.id],
        queryFn: async () => {
            const { data } = await api.get(`/products/${params.id}/reviews`);
            return data;
        }
    });

    const addReviewMutation = useMutation({
        mutationFn: async (reviewPayload: any) => {
            const { data } = await api.post('/reviews', reviewPayload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', params.id] });
            queryClient.invalidateQueries({ queryKey: ['product', params.id] });
            setIsReviewOpen(false);
            setComment('');
            toast.success('Review submitted successfully!');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        }
    });

    const getAllImages = (): string[] => {
        if (!dbData?.images || dbData.images.length === 0) {
            return [resolveImageUrl(dbData?.img || dbData?.image)];
        }
        return dbData.images.map((imgObj: any) => resolveImageUrl(imgObj));
    };

    // Mock product data fallback
    const mockProduct = {
        _id: params.id,
        title: 'Midnight Silk Slip',
        price: 12000,
        originalPrice: 15000,
        img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
        description: 'Crafted from the finest mulberry silk, this midnight blue slip dress features a bias cut that drapes flawlessly over your silhouette. Perfect for evening soirées.',
        summary: 'Luxurious silk slip dress for elegant evenings.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stock: { 'M': 2, 'L': 0 },
    };

    const product = dbData ? {
        _id: dbData._id || params.id,
        title: dbData.name || dbData.title || mockProduct.title,
        price: dbData.price || mockProduct.price,
        originalPrice: dbData.originalPrice || ((dbData.price || 12000) * 1.4),
        img: resolveImageUrl(dbData.images?.[0] || dbData.img),
        description: dbData.description || mockProduct.description,
        summary: dbData.summary || mockProduct.summary,
        sizes: dbData.sizes?.length > 0 ? dbData.sizes : mockProduct.sizes,
        stock: typeof dbData.stock === 'number' ? {
            'XS': dbData.stock, 'S': Math.max(0, dbData.stock - 1), 'M': dbData.stock, 'L': Math.max(0, dbData.stock - 2), 'XL': dbData.stock
        } : (dbData.stock || mockProduct.stock),
    } : mockProduct;

    useEffect(() => {
        const interval = setInterval(() => {
            setViewers(prev => prev + Math.floor(Math.random() * 5) - 2);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleAddToCart = () => {
        if (!selectedSize) return;

        addToCart({
            _id: product._id,
            name: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity: 1,
            size: selectedSize,
            image: product.img
        });

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addReviewMutation.mutate({
            product: product._id,
            rating,
            comment
        });
    };

    if (isLoading) {
        return <div className="min-h-[70vh] flex items-center justify-center text-gray-400 font-medium font-serif">Curating Details...</div>;
    }

    const allImages = getAllImages();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover transition-opacity duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'; }}
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider text-rose-600 shadow-sm animate-pulse-slow">
                            🔥 Trending
                        </div>
                    </div>

                    {/* Thumbnails Row */}
                    {allImages.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {allImages.map((url: string, idx: number) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setMainImage(url)}
                                    className={`relative aspect-[3/4] cursor-pointer rounded-md overflow-hidden border-2 transition-all ${mainImage === url ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                    {/* Social Proof: Live Viewers */}
                    <div className="flex items-center space-x-2 text-rose-600 bg-rose-50 w-max px-3 py-1.5 rounded-full text-sm font-medium mb-4 border border-rose-100">
                        <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                        <span>{viewers} people are viewing this right now</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                        {product.title}
                    </h1>

                    {/* Summary (Point 131) */}
                    {product.summary && (
                        <p className="text-gray-500 font-medium italic mb-4 text-sm">
                            {product.summary}
                        </p>
                    )}

                    {/* Reviews Trust Signal */}
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-gray-500 text-sm underline cursor-pointer">4.9 (128 reviews)</span>
                    </div>

                    <div className="flex items-end space-x-4 mb-2">
                        <span className="text-4xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        <span className="text-xl text-gray-400 line-through mb-1">₹{product.originalPrice.toLocaleString()}</span>
                        <div className="flex flex-col">
                            <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded mb-1 w-max">
                                Save ₹{(product.originalPrice - product.price).toLocaleString()}!
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="mb-8 border-t border-gray-100 pt-6">
                        {/* Select Size */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-900">Select Size</span>
                            <span className="text-sm text-gray-500 underline cursor-pointer">Size Guide</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {product.sizes.map((item: any) => {
                                const sizeLabel = typeof item === 'string' ? item : item.size;
                                const stockValue = typeof item === 'string' 
                                    ? (product.stock?.[item] ?? 10) 
                                    : (item.stock ?? 0);
                                
                                const isOutOfStock = stockValue === 0;
                                const isLowStock = stockValue > 0 && stockValue <= 3;

                                return (
                                    <button
                                        key={sizeLabel}
                                        disabled={isOutOfStock}
                                        onClick={() => setSelectedSize(sizeLabel)}
                                        className={`
                                            relative py-3 border rounded-md text-sm font-medium transition-all
                                            ${selectedSize === sizeLabel ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-900 hover:border-black'}
                                            ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : ''}
                                        `}
                                    >
                                        {sizeLabel}
                                        {isOutOfStock && (
                                            <svg className="absolute inset-0 w-full h-full text-gray-300 stroke-2" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" />
                                            </svg>
                                        )}
                                        {isLowStock && (
                                            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                                                {stockValue} left
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <Button
                            size="lg"
                            className="flex-1 text-lg h-14 bg-rose-600 text-white hover:bg-rose-700 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                            disabled={!selectedSize}
                            onClick={handleAddToCart}
                        >
                            {selectedSize ? `Add to Cart - ₹${product.price.toLocaleString()}` : 'Select a Size'}
                        </Button>
                    </div>

                    {/* Bundle Offer */}
                    <div className="mt-8 bg-rose-50 border border-rose-100 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900">Bundle & Save 20%</h3>
                            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-full">Limited Offer</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-16 h-20 bg-gray-200 rounded-md overflow-hidden relative shrink-0 border border-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={product.img} alt="Dress" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-2xl text-rose-300 font-light">+</span>
                            <div className="w-16 h-20 bg-gray-200 rounded-md overflow-hidden relative shrink-0 border border-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80" alt="Heels" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 ml-3">
                                <p className="text-sm font-bold text-gray-900 leading-tight mb-1">Add matching Stiletto Heels</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-rose-600 font-bold">₹15,200</span>
                                    <span className="text-xs text-gray-400 line-through">₹19,000</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4 bg-white hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors shadow-sm">
                            Add Bundle to Bag
                        </Button>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500 border-t border-gray-100 pt-6">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            <span>Free Delivery & Returns</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>100% Money Back Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dopamine Add-To-Cart Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-6 right-6 z-50 bg-black text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-4"
                    >
                        <div className="bg-green-500 rounded-full p-1">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">Added to bag!</p>
                            <p className="border-b border-gray-500 inline-block text-xs cursor-pointer" onClick={() => window.location.href = '/cart'}>View Cart & Checkout</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
