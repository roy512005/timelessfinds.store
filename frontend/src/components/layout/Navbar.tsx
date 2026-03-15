'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSettingsStore } from '@/store/settingsStore';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export const Navbar = () => {
    const { items: cart } = useCartStore();
    const { items: wishlist } = useWishlistStore();
    const [navScrolled, setNavScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const { settings, fetchSettings } = useSettingsStore();
    
    useEffect(() => {
        fetchSettings();
        const onScroll = () => setNavScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const cartCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;

    const navCategories = {
        Women: [
            ['Sarees', '/dresses?category=Sarees'],
            ['Suit Sets', '/dresses?category=Suit+Sets'],
            ['Kurta Sets', '/dresses?category=Kurta+Sets'],
            ['Dresses', '/dresses?category=Dresses'],
            ['Co-ord Sets', '/dresses?category=Co-ord+Sets'],
            ['Kurtis', '/dresses?category=Kurtis'],
            ['Lehengas', '/dresses?category=Lehengas'],
            ['Party Wear', '/dresses?tag=party'],
        ],
        Men: [
            ['Kurta', '/dresses?gender=Men&category=Ethnic+Wear'],
            ['Kalamkari Shirt', '/dresses?gender=Men&category=Kalamkari+Shirt'],
            ['Festive Wear', '/dresses?gender=Men&tag=festive'],
            ['Ethnic Wear', '/dresses?gender=Men'],
        ]
    };

    return (
        <div className="sticky top-0 z-50">
            {/* ── Announcement Bar ─────────────────────── */}
            <div className="bg-black text-white text-center py-1 text-[9px] font-bold tracking-[0.15em] uppercase">
                {settings?.topBannerText || 'Free Shipping Over ₹999 | Easy Returns & Exchanges'}
            </div>

            {/* ── Sticky Navbar ────────────────────────── */}
            <header
                className={`transition-all duration-300 ${navScrolled
                    ? 'bg-white shadow-[0_1px_20px_rgba(0,0,0,0.08)]'
                    : 'bg-white border-b border-gray-100'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 relative">
                    {/* 📱 Mobile Left Icons (Menu + Search) */}
                    <div className="flex md:hidden items-center gap-0.5">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-gray-700"
                            aria-label="Menu"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSearchOpen((o) => !o)}
                            className="p-2 text-gray-700"
                            aria-label="Search"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                    </div>

                    {/* 🏷️ Logo (Centered on Mobile, Left on Desktop) */}
                    <div className="md:static absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 z-10 flex items-center">
                        <Link href="/" className="flex items-center gap-1.5 shrink-0">
                            <img
                                src="/logo.png"
                                alt="Timeless Finds"
                                className="h-9 sm:h-12 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* 🖥️ Desktop Navigation (Center/Left) */}
                    <nav className="hidden md:flex items-center gap-8 h-full" aria-label="Main navigation">
                        <Link
                            href="/new-arrivals"
                            className="text-gray-900 font-bold hover:text-rose-600 transition-colors relative text-[11px] uppercase tracking-widest group"
                        >
                            New Arrivals
                        </Link>

                        {/* Women Dropdown */}
                        <div 
                            className="relative h-full flex items-center group cursor-pointer"
                            onMouseEnter={() => setActiveDropdown('women')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <span className="text-gray-900 font-bold group-hover:text-rose-600 transition-colors text-[11px] uppercase tracking-widest flex items-center gap-1">
                                Women <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'women' ? 'rotate-180' : ''}`} />
                            </span>
                            <AnimatePresence>
                                {activeDropdown === 'women' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 py-4 min-w-[200px] z-50 rounded-b-lg"
                                    >
                                        <div className="flex flex-col">
                                            {navCategories.Women.map(([label, href]) => (
                                                <Link
                                                    key={label}
                                                    href={href}
                                                    className="px-6 py-2.5 text-xs font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 transition-all uppercase tracking-wider"
                                                >
                                                    {label}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Men Dropdown */}
                        <div 
                            className="relative h-full flex items-center group cursor-pointer"
                            onMouseEnter={() => setActiveDropdown('men')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <span className="text-gray-900 font-bold group-hover:text-rose-600 transition-colors text-[11px] uppercase tracking-widest flex items-center gap-1">
                                Men <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'men' ? 'rotate-180' : ''}`} />
                            </span>
                            <AnimatePresence>
                                {activeDropdown === 'men' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 py-4 min-w-[200px] z-50 rounded-b-lg"
                                    >
                                        <div className="flex flex-col">
                                            {navCategories.Men.map(([label, href]) => (
                                                <Link
                                                    key={label}
                                                    href={href}
                                                    className="px-6 py-2.5 text-xs font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 transition-all uppercase tracking-wider"
                                                >
                                                    {label}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link href="/collections" className="text-gray-900 font-bold hover:text-rose-600 transition-colors text-[11px] uppercase tracking-widest">
                            Collections
                        </Link>
                        <Link href="/sale" className="text-rose-600 font-bold hover:text-rose-800 transition-colors text-[11px] uppercase tracking-widest flex items-center gap-1">
                            Sale
                        </Link>
                    </nav>

                    {/* 🖥️ Desktop Icons */}
                    <div className="hidden md:flex items-center gap-1">
                        <button
                            id="nav-search"
                            onClick={() => setSearchOpen((o) => !o)}
                            className="p-2.5 text-gray-700 hover:text-rose-600 transition-colors"
                            aria-label="Search"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>

                        <Link href="/wishlist" id="nav-wishlist" className="p-2.5 text-gray-700 hover:text-rose-600 transition-colors relative" aria-label="Wishlist">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {wishlistCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link href="/cart" id="nav-cart" className="p-2.5 text-gray-700 hover:text-black transition-colors relative" aria-label="Cart">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-1.5 right-1.5 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        <Link href="/account" id="nav-profile" className="p-2.5 text-gray-700 hover:text-black transition-colors" aria-label="Account">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        </Link>
                    </div>

                    {/* 📱 Mobile Right Icons (Cart + Account) */}
                    <div className="flex md:hidden items-center gap-0.5 ml-auto z-10">
                        <Link href="/cart" className="p-2 text-gray-700 relative" aria-label="Cart">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/account" className="p-2 text-gray-700" aria-label="Account">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Search Bar Dropdown */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-gray-100 bg-white"
                        >
                            <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-3">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-5 py-2.5">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input
                                        id="search-input"
                                        autoFocus
                                        type="text"
                                        placeholder="Search dresses, styles, collections…"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
                                    />
                                    {searchQuery && (
                                        <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-700">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
                        >
                            <div className="px-6 py-4 flex flex-col gap-4">
                                {[
                                    ['New Arrivals', '/new-arrivals'],
                                    ['Women', '/dresses?gender=women'],
                                    ['Men', '/dresses?gender=men'],
                                    ['Collections', '/collections'],
                                    ['Wishlist', '/wishlist'],
                                    ['Sale', '/sale'],
                                ].map(([label, href]) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`text-xs font-bold uppercase tracking-widest ${label === 'Sale' ? 'text-rose-600' : 'text-gray-800'
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </div>
    );
};
