'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

const LINKS = {
    Shop: [
        ['New Arrivals', '/new-arrivals'],
        ['Dresses', '/dresses'],
        ['Collections', '/collections'],
        ['Sale', '/sale'],
        ['Lookbook', '/lookbook'],
        ['Outfit Builder', '/outfit-builder'],
    ],
    Support: [
        ['My Account', '/account'],
        ['Sign In', '/login'],
        ['FAQ', '/faq'],
        ['Size Guide', '/size-guide'],
        ['Track Order', '/track-order'],
        ['Contact Us', '/contact'],
        ['Shipping Policy', '/shipping-policy'],
        ['Return Policy', '/return-policy'],
    ],
    Community: [
        ['#TimelessFinds', '#'],
        ['Influencer Program', '#'],
        ['Affiliate Partners', '#'],
        ['Our Story', '/about'],
        ['Careers', '#'],
        ['Blog', '#'],
    ],
};

export const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const { settings, fetchSettings } = useSettingsStore();

    useEffect(() => {
        if (!settings) fetchSettings();
    }, [settings, fetchSettings]);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <footer className="bg-[#0a0a0a] text-gray-400">
            {/* Trust Strip */}
            <div className="border-b border-white/10">
                <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { icon: '🚚', label: 'Free Shipping', sub: `On orders over ₹${settings?.freeShippingThreshold || 999}` },
                        { icon: '↩️', label: 'Easy Returns', sub: '7-day hassle-free returns' },
                        { icon: '🔒', label: 'Secure Payment', sub: 'UPI • Card • COD' },
                        { icon: '✨', label: 'Premium Quality', sub: 'Handcrafted in India' },
                    ].map((t) => (
                        <div key={t.label} className="flex flex-col items-center gap-2">
                            <span className="text-3xl">{t.icon}</span>
                            <p className="text-sm font-bold text-white">{t.label}</p>
                            <p className="text-gray-500 text-xs">{t.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
                {/* Brand Column */}
                <div className="col-span-2 md:col-span-1">
                    <Link href="/" className="flex items-center gap-1.5 mb-4">
                        <img 
                            src="/logo-footer.png" 
                            alt="Timeless Finds" 
                            className="h-10 w-auto object-contain brightness-110" 
                        />
                    </Link>
                    <p className="text-xs leading-relaxed text-gray-500 mb-6">
                        Curated dresses for women who own every room they walk into. Born in Mumbai, worn everywhere.
                    </p>
                    {/* Socials */}
                    <div className="flex gap-3">
                        <a
                            href={settings?.socialLinks?.instagram || "https://instagram.com"}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                            className="w-8 h-8 bg-white/10 flex items-center justify-center hover:bg-rose-600 transition-colors rounded-sm"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        <a
                            href={settings?.socialLinks?.facebook || "https://facebook.com"}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                            className="w-8 h-8 bg-white/10 flex items-center justify-center hover:bg-rose-600 transition-colors rounded-sm"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                        <a
                            href={settings?.socialLinks?.youtube || "https://youtube.com"}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="YouTube"
                            className="w-8 h-8 bg-white/10 flex items-center justify-center hover:bg-rose-600 transition-colors rounded-sm"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a0a0a" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Link Columns */}
                {(Object.entries(LINKS) as [string, string[][]][]).map(([heading, links]) => (
                    <div key={heading}>
                        <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-5">{heading}</h4>
                        <ul className="space-y-3">
                            {links.map(([label, href]) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className={`text-xs hover:text-white transition-colors ${label === 'Sale' ? 'text-rose-400 font-semibold' : ''
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Newsletter */}
                <div className="col-span-2 md:col-span-1">
                    <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-5">Stay in the Loop</h4>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        New drops, exclusive offers, and style inspo — straight to your inbox.
                    </p>
                    {subscribed ? (
                        <div className="bg-rose-600/20 border border-rose-600/40 rounded-sm px-4 py-4 text-center">
                            <p className="text-rose-400 text-xs font-bold">✓ You&apos;re on the list!</p>
                            <p className="text-gray-500 text-[11px] mt-1">Check your inbox for a welcome gift.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <input
                                type="email"
                                id="footer-newsletter-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-white/10 border border-white/20 text-white text-xs px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
                            />
                            <button
                                type="submit"
                                id="footer-newsletter-submit"
                                className="w-full bg-rose-600 text-white text-xs font-bold uppercase tracking-widest py-3 hover:bg-rose-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-gray-600">
                        © 2025 Timeless Finds. All rights reserved. Crafted with ♥ in India.
                    </p>
                    <div className="flex flex-wrap justify-center gap-5 text-[11px]">
                        {[['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms'], ['Cookie Policy', '#'], ['Shipping Policy', '/shipping-policy']].map(
                            ([label, href]) => (
                                <Link key={label} href={href} className="hover:text-white transition-colors">
                                    {label}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};
