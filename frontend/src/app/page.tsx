'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard, type Product } from '@/components/ui/ProductCard';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


const REVIEWS = [
  { name: 'Priya S.', city: 'Mumbai', rating: 5, text: 'Absolutely stunning quality. The Midnight Silk Slip fits like it was made for me. Got so many compliments at the gala!', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { name: 'Ananya K.', city: 'Delhi', rating: 5, text: 'Ordered the Rose Velvet Midi for a wedding — it was a literal showstopper. Luxury feel at an unbelievable price.', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
  { name: 'Simran T.', city: 'Bangalore', rating: 5, text: 'DressAura packaging is gorgeous too! Felt like I was unboxing a luxury brand. Will definitely be a repeat customer.', img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80' },
];

const INSTAGRAM = [
  { img: 'https://images.unsplash.com/photo-1515372039744-b0f0234acbc6?w=400&q=80', handle: '@priya.styles', likes: '12.4k' },
  { img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', handle: '@simran_chic', likes: '8.9k' },
  { img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80', handle: '@thedelhistyle', likes: '24.1k' },
  { img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80', handle: '@neha.vogue', likes: '15.2k' },
  { img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80', handle: '@ananya_daily', likes: '9.3k' },
  { img: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80', handle: '@mumbai.muse', likes: '18.7k' },
];

const DEFAULT_TICKER = [
  'New Arrivals Weekly',
  'Free Shipping Over ₹999',
  '8,200+ Happy Customers',
  'Handcrafted in India',
  'Easy Returns',
];

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1600&q=90';
const PROMO_FALLBACK = 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=1600&q=85';
const CREATOR_FALLBACK = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=85';


/* ─── Main Page ──────────────────────────────────────── */
export default function Home() {
  const [activeReview, setActiveReview] = useState(0);

  // ─── Data Fetching ───────────────────────────────────
  const { data: hero } = useQuery({
    queryKey: ['hero'],
    queryFn: async () => (await api.get('/home/hero')).data,
    staleTime: 5 * 60 * 1000,       // 5 min – prevents a refetch wipe
    placeholderData: (prev: any) => prev,   // keep the old hero while loading new
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['look-categories'],
    queryFn: async () => (await api.get('/home/look-categories')).data,
    staleTime: 5 * 60 * 1000,
  });

  const { data: trendingProducts = [] } = useQuery({
    queryKey: ['trending-home'],
    queryFn: async () => {
      // Group multiple categories in a single request for speed
      const res = await api.get('/products?category=Dresses|Suit Sets|Kurta Sets|Co-ord Sets&gender=Women&limit=25');
      const items = res.data || [];
      const grouped: Record<string, any[]> = {};
      items.forEach((p: any) => {
        const cat = p.category || 'other';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(p);
      });
      const mixed: any[] = [];
      const keys = Object.keys(grouped);
      let i = 0;
      while (mixed.length < 10 && keys.length > 0) {
        const key = keys[i % keys.length];
        if (grouped[key].length > 0) mixed.push(grouped[key].shift());
        else keys.splice(i % keys.length, 1);
        if (grouped[key]?.length > 0) i++;
      }
      return mixed.length > 0 ? mixed : items.slice(0, 10);
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: newArrivalsProducts = [] } = useQuery({
    queryKey: ['new-arrivals-home'],
    queryFn: async () => {
      // Group multiple categories in a single request for speed
      const res = await api.get('/products?category=Dresses|Suit Sets|Kurta Sets|Co-ord Sets|Kurtis&gender=Women&sort=new&limit=25');
      const items = res.data || [];
      const grouped: Record<string, any[]> = {};
      items.forEach((p: any) => {
        const cat = p.category || 'other';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(p);
      });
      const mixed: any[] = [];
      const keys = Object.keys(grouped);
      let i = 0;
      while (mixed.length < 12 && keys.length > 0) {
        const key = keys[i % keys.length];
        if (grouped[key].length > 0) mixed.push(grouped[key].shift());
        else keys.splice(i % keys.length, 1);
        if (grouped[key]?.length > 0) i++;
      }
      return mixed.length > 0 ? mixed : items.slice(0, 12);
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: boysProducts = [] } = useQuery({
    queryKey: ['boys-home'],
    queryFn: async () => (await api.get('/products?gender=Men&limit=10')).data,
    staleTime: 5 * 60 * 1000,
  });

  const { data: promo } = useQuery({
    queryKey: ['promo'],
    queryFn: async () => (await api.get('/home/promo')).data,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev: any) => prev,
  });

  const { data: creators = [] } = useQuery({
    queryKey: ['creator'],
    queryFn: async () => (await api.get('/home/creator')).data,
    staleTime: 5 * 60 * 1000,
  });
  const creator = creators?.[0] || null;

  const { data: reviews = [] } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => (await api.get('/reviews/featured')).data,
    staleTime: 5 * 60 * 1000,
  });

  const { data: instagram = [] } = useQuery({
    queryKey: ['instagram'],
    queryFn: async () => (await api.get('/social/instagram')).data,
    staleTime: 5 * 60 * 1000,
  });

  const { data: topBanners = [] } = useQuery({
    queryKey: ['top-banners'],
    queryFn: async () => (await api.get('/home/top-banners')).data,
    staleTime: 5 * 60 * 1000,
  });

  const tickerItems = topBanners.length > 0
    ? topBanners.map((b: any) => b.text)
    : DEFAULT_TICKER;

  useEffect(() => {
    if (!reviews?.length) return;
    const t = setInterval(() => setActiveReview((r) => (r + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews]);

  // ─── Resolve Image URL ─────────────────────────────────
  const resolveImage = (path: string | undefined, fallback: string): string => {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;
    // Derive server base URL from axios config (http://localhost:5001/api -> http://localhost:5001)
    const serverBase = api.defaults.baseURL?.replace('/api', '') || 'http://localhost:5001';
    return `${serverBase}/${path.startsWith('/') ? path.slice(1) : path}`;
  };

  const getCategoryPlaceholder = (name: string, idx: number) => {
    // Unique-looking placeholders based on index to avoid "multi card same image"
    const ids = [
      1595777457583, 1515372039744, 1496747611176, 1539008835657, 1566150905458, 
      1552374196644, 1515886657613, 1490481651871, 1520112712678, 1515886657613,
      1591551105151, 1610030469983, 1610189012906, 1583391733956, 1543076447215,
      1620712943543, 1539008835657, 1572804013427, 1544005313944
    ];
    // Simple hash for name to shift index
    const shift = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const id = ids[(idx + shift) % ids.length];
    return `https://images.unsplash.com/photo-${id}?w=400&q=80`;
  };

  // heroImg always has a value – fallback ensures we never get a blank banner
  const heroImg = hero?.image
    ? (hero.image.startsWith('http') ? hero.image : `${api.defaults.baseURL?.replace('/api', '') || 'http://localhost:5001'}/${hero.image.replace(/^\//, '')}`)
    : HERO_FALLBACK;
  const promoImg = promo?.image
    ? (promo.image.startsWith('http') ? promo.image : `${api.defaults.baseURL?.replace('/api', '') || 'http://localhost:5001'}/${promo.image.replace(/^\//, '')}`)
    : PROMO_FALLBACK;
  const creatorImg = creator?.image
    ? (creator.image.startsWith('http') ? creator.image : `${api.defaults.baseURL?.replace('/api', '') || 'http://localhost:5001'}/${creator.image.replace(/^\//, '')}`)
    : CREATOR_FALLBACK;
  
  // Pre-load the heroImg so it doesn't flicker
  const [loadedHeroImg, setLoadedHeroImg] = useState(heroImg);
  useEffect(() => { if (heroImg) setLoadedHeroImg(heroImg); }, [heroImg]);

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── 1. Hero Section ─────────────────────────── */}
      <section id="hero" className="relative h-auto aspect-[9/16] md:aspect-auto md:h-[92vh] md:min-h-[560px] flex items-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 w-full h-full z-0">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            speed={800}
            className="w-full h-full"
          >
            {[
              loadedHeroImg,
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=90',
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=90'
            ].map((imgUrl, idx) => (
              <SwiperSlide key={idx} className="w-full h-full flex justify-center items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={hero?.title || "Timeless Finds Hero"}
                  className="w-full h-full object-cover object-top opacity-65 scale-[1.02]"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    if (t.src !== HERO_FALLBACK) t.src = HERO_FALLBACK;
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <p className="text-rose-400 text-xs font-bold uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-rose-400 inline-block" />
            {hero?.subtitle || "TIMELESS FINDS"}
          </p>
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black text-white leading-[1.05] mb-6 whitespace-pre-line drop-shadow-lg">
            {hero?.title || "Own\nThe Room."}
          </h1>
          <p className="text-gray-300 text-base md:text-lg font-light max-w-md mb-10 leading-relaxed drop-shadow-md">
            {hero?.description || "Elegant dresses crafted for modern women who command every entrance."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={hero?.button1_link || "/new-arrivals"}
              id="hero-cta-1"
              className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-xl"
            >
              {hero?.button1_text || "Shop New Arrivals"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <Link
              href={hero?.button2_link || "/collections"}
              id="hero-cta-2"
              className="inline-flex items-center justify-center gap-2 border border-white/50 text-white text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-white/10 transition-all duration-300"
            >
              {hero?.button2_text || "Explore Collection"}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 pointer-events-none z-20">
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
          <div className="w-px h-10 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 w-full bg-white/60 animate-[scrollLine_1.8s_ease-in-out_infinite]" style={{ height: '40%' }} />
          </div>
        </div>
      </section>

      {/* ── 2. Ticker ─────────────────────────────────── */}
      <div className="bg-black text-white/60 py-3 overflow-hidden border-b border-white/10">
        <div className="flex whitespace-nowrap animate-[ticker_30s_linear_infinite]">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] pr-16">
              {tickerItems.map((item: string, j: number) => (
                <span key={j}>
                  {item} &nbsp;✦&nbsp;{' '}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. Find Your Look — Swiper ─────────────── */}
      <section id="categories" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-rose-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">Shop by Style</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Find Your Look</h2>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="relative max-w-[100vw] overflow-hidden group/nav">
            <div className="max-w-7xl mx-auto px-4">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={12}
                slidesPerView={2.2}
                navigation={{
                  nextEl: '.cat-next',
                  prevEl: '.cat-prev',
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                loop={categories.length > 4}
                breakpoints={{
                  480: { slidesPerView: 2.5, spaceBetween: 14 },
                  640: { slidesPerView: 3.2, spaceBetween: 14 },
                  1024: { slidesPerView: 4, spaceBetween: 16 },
                  1280: { slidesPerView: 4, spaceBetween: 16 },
                }}
              >
                {categories.map((cat: any, idx: number) => (
                  <SwiperSlide key={cat._id || idx}>
                    <Link
                      href={`/dresses?category=${cat.slug || cat.name?.toLowerCase()}`}
                      className="group relative overflow-hidden aspect-[3/4] bg-gray-200 block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveImage(cat.image, getCategoryPlaceholder(cat.name, idx))}
                        alt={cat.name || 'Category'}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { 
                          const target = e.target as HTMLImageElement;
                          if (target.src !== getCategoryPlaceholder(cat.name, idx)) {
                            target.src = getCategoryPlaceholder(cat.name, idx);
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 inset-x-0 p-5">
                        <h3 className="text-white font-serif font-bold text-lg leading-tight">{cat.name}</h3>
                        <span className="text-white/70 text-xs font-semibold uppercase tracking-wider mt-1 flex items-center gap-1.5 group-hover:text-rose-400 transition-colors">
                          Shop Now
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </span>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Navigation arrows */}
            <button className="cat-prev absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-800 hover:bg-black hover:text-white transition-all opacity-0 group-hover/nav:opacity-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button className="cat-next absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-800 hover:bg-black hover:text-white transition-all opacity-0 group-hover/nav:opacity-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. Trending (max 10) ───────────────────── */}
      <section id="trending" className="bg-[#fafaf9] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8 gap-4 pb-2 border-b border-gray-100/50">
            <div>
              <p className="text-rose-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-1.5">What Everyone&#39;s Wearing</p>
              <h2 className="text-xl md:text-3xl font-serif font-bold text-gray-900">Trending Now</h2>
            </div>
            <Link href="/dresses?tag=trending" className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-0.5 hover:text-rose-600 hover:border-rose-600 transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-12">
            {trendingProducts.length > 0 ? (
              trendingProducts.slice(0, 10).map((p: any) => (
                <ProductCard key={p._id || p.id} p={p} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-sm text-gray-400 font-bold uppercase tracking-widest">
                Loading Trending Items...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. New Arrivals (max 10) ───────────────── */}
      <section id="new-arrivals" className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-8 gap-4 pb-2 border-b border-gray-100/50">
          <div>
            <p className="text-rose-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-1.5">Just Dropped</p>
            <h2 className="text-xl md:text-3xl font-serif font-bold text-gray-900">New Arrivals</h2>
          </div>
          <Link href="/new-arrivals" className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-0.5 hover:text-rose-600 hover:border-rose-600 transition-colors">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-12">
          {newArrivalsProducts.length > 0 ? (
            newArrivalsProducts.slice(0, 10).map((p: any) => (
              <ProductCard key={p._id || p.id} p={p} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-sm text-gray-400 font-bold uppercase tracking-widest">
              Loading New Arrivals...
            </div>
          )}
        </div>
      </section>

      {/* ── 5.5 Boys' Collection ───────────────── */}
      {boysProducts.length > 0 && (
        <section id="boys-collection" className="bg-[#fcfaf7] py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8 gap-4 pb-2 border-b border-gray-100/50">
              <div>
                <p className="text-rose-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-1.5">For the Gentlemen</p>
                <h2 className="text-xl md:text-3xl font-serif font-bold text-gray-900">Boys&apos; Ethnic Wear</h2>
              </div>
              <Link href="/dresses?gender=men" className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-0.5 hover:text-rose-600 hover:border-rose-600 transition-colors">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-12">
              {boysProducts.slice(0, 10).map((p: any) => (
                <ProductCard key={p._id || p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. Category Product Sections (10 each) ── */}
      {categories.slice(0, 6).map((cat: any) => (
        <CategoryProductSection key={cat._id} category={cat} />
      ))}

      {/* ── 7. Limited Collection (Fully Dynamic) ─── */}
      <section id="promo-banner" className="relative py-28 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={promoImg}
          alt={promo?.title || "Limited Collection"}
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { (e.target as HTMLImageElement).src = PROMO_FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-rose-400 text-xs font-bold uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-rose-400" />
            {promo?.badge || "Limited Collection"}
          </p>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-white mb-4 leading-tight whitespace-pre-line">
            {promo?.title || "Midnight Gala\nCollection"}
          </h2>
          <p className="text-gray-300 text-base md:text-lg font-light max-w-lg mb-8 leading-relaxed">
            {promo?.description || "Handcrafted couture for the woman who arrives and never goes unnoticed. Only 50 pieces available — ever."}
          </p>
          {(promo?.pieces_left || promo?.time_left) && (
            <div className="flex flex-wrap items-center gap-6 mb-10">
              {promo?.pieces_left && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-5 py-3 text-center">
                  <p className="text-white text-2xl font-bold font-mono">{promo.pieces_left}</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest">Pieces Left</p>
                </div>
              )}
              {promo?.time_left && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-5 py-3 text-center">
                  <p className="text-white text-2xl font-bold font-mono">{promo.time_left}</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest">Time Left</p>
                </div>
              )}
            </div>
          )}
          <Link
            href={promo?.cta_link || "/collections"}
            id="gala-cta"
            className="inline-flex items-center gap-3 bg-rose-600 text-white text-sm font-bold uppercase tracking-widest px-10 py-4 hover:bg-rose-700 transition-colors shadow-[0_0_40px_rgba(225,29,72,0.4)]"
          >
            {promo?.cta_text || "Shop The Collection"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
      </section>

      {/* ── 8. Creator Collaboration (Fully Dynamic) ── */}
      <section id="influencer" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative aspect-[4/5] overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={creatorImg}
                alt={creator?.name || "Creator"}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = CREATOR_FALLBACK; }}
              />
              <div className="absolute top-5 left-5 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                Live Now • Limited Edition
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <p className="text-rose-500 text-xs font-bold uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-rose-500" />
                Creator Collaboration
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6 leading-tight whitespace-pre-line">
                {creator?.name ? (
                  <>Aura ×<br /><span className="text-rose-600">{creator.handle}</span></>
                ) : (
                  <>Aura ×<br /><span className="text-rose-600">@PriyaStyles</span></>
                )}
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                {creator?.description || "India's most influential fashion creator teamed up with DressAura to craft the \"Bombay Nights\" capsule — 100 pieces ethically made in Mumbai. Once sold, never restocked."}
              </p>
              <div className="flex items-center gap-8 mb-10">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{creator?.followers || "2.1M"}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Followers</p>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{creator?.pieces_total || "100"}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Pieces Only</p>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-rose-600">{creator?.pieces_remaining || "43"}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Remaining</p>
                </div>
              </div>
              <Link
                href={creator?.cta_link || "/collections"}
                id="influencer-cta"
                className="inline-flex items-center gap-2 bg-black text-white text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-gray-900 transition-colors"
              >
                {creator?.cta_text || "Shop The Drop"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Customer Reviews ─────────────────────── */}
      <section id="reviews" className="bg-[#fafaf9] py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-rose-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">Real Women, Real Aura</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-2 mb-14">
            <div className="flex items-center gap-0.5 text-yellow-500">
              {[1, 2, 3, 4, 5].map(i => <svg key={i} width={20} height={20} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
            </div>
            <span className="text-gray-700 font-bold text-lg ml-1">4.9</span>
            <span className="text-gray-400 text-sm">/ 5 from 1,800+ reviews</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(reviews.length > 0 ? reviews : REVIEWS).map((r: any, i: number) => (
              <div
                key={i}
                className={`bg-white p-7 text-left rounded-sm shadow-sm border transition-all duration-300 ${i === activeReview ? 'border-rose-200 shadow-rose-100 shadow-md' : 'border-gray-100'}`}
              >
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {[1, 2, 3, 4, 5].map(j => <svg key={j} width={14} height={14} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6">&ldquo;{r.text || r.comment}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-rose-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.img || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"} alt={r.name || r.user_id?.name || "Customer"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{r.name || r.user_id?.name}</p>
                    <p className="text-xs text-gray-400">{r.city || "Verified Buyer"} · Verified Purchase</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {(reviews.length > 0 ? reviews : REVIEWS).map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setActiveReview(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeReview ? 'bg-rose-500 w-5' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Instagram Gallery ─────────────────── */}
      <section id="community" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-rose-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">Join the Community</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">#DressAura</h2>
            <p className="text-gray-500 text-sm">Tag us to be featured • @dressaura.official</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {(instagram.length > 0 ? instagram : INSTAGRAM).map((post: any, i: number) => (
              <a href={post.postUrl || "#"} key={i} target="_blank" rel="noreferrer" className="relative aspect-square overflow-hidden group cursor-pointer block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image_url || post.img}
                  alt={post.handle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="mb-1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  <span className="text-white text-xs font-bold">{post.likes}</span>
                  <span className="text-white/70 text-[10px] mt-0.5">{post.handle}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://instagram.com/dressaura.official"
              target="_blank"
              rel="noreferrer"
              id="instagram-link"
              className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 text-sm font-bold uppercase tracking-widest px-8 py-3.5 hover:bg-black hover:text-white transition-all duration-300"
            >
              Follow @DressAura
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}


/* ─── Per-Category Section Component ────────────────── */
function CategoryProductSection({ category }: { category: any }) {
  const { data: products = [] } = useQuery({
    queryKey: ['category-products', category._id],
    queryFn: async () => {
      const { data } = await api.get(`/products?category=${category.slug || category.name}&limit=10`);
      return data;
    },
    enabled: !!category.name,
  });

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-100">
      <div className="flex items-end justify-between mb-8 gap-4 pb-2 border-b border-gray-100/50">
        <div>
          <p className="text-rose-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-1">{category.name}</p>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900">
            Shop {category.name}
          </h2>
        </div>
        <Link
          href={`/dresses?category=${category.slug || category.name?.toLowerCase()}`}
          className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-0.5 hover:text-rose-600 hover:border-rose-600 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10">
        {products.slice(0, 10).map((p: any) => (
          <ProductCard key={p._id || p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
