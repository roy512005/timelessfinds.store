'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, ShoppingBag, Layers, ShoppingCart,
    Users, TicketPercent, Image as ImageIcon, BarChart3,
    Settings, LogOut, Search, Bell, Truck, RotateCcw, Warehouse,
    LayoutTemplate
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // Wait for Zustand to finish loading from localStorage
        const checkHydration = setInterval(() => {
            if (useAuthStore.persist.hasHydrated()) {
                setHydrated(true);
                clearInterval(checkHydration);
            }
        }, 50);
        return () => clearInterval(checkHydration);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        
        if (pathname === '/admin/login') {
            setIsAuthorized(true);
            return;
        }

        if (!user) {
            router.push('/admin/login');
        } else if (user.role !== 'admin') {
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [user, router, pathname, hydrated]);

    // Don't render until Zustand hydrates to grab the user from localStorage
    if (!hydrated) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-serif">Loading securely...</div>;
    }

    if (!isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-serif">Checking permissions...</div>;
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: ShoppingBag },
        { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
        { name: 'Collections', href: '/admin/collections', icon: Layers },
        { name: 'Categories', href: '/admin/categories', icon: Layers },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Delivery Boys', href: '/admin/delivery-boys', icon: Truck },
        { name: 'Returns', href: '/admin/returns', icon: RotateCcw },
        { name: 'Customers', href: '/admin/customers', icon: Users },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercent },
        { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
        { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
        { name: 'Homepage', href: '/admin/homepage', icon: LayoutTemplate },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 selection:bg-rose-100 selection:text-rose-900">
            {/* Professional Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-20">
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg mr-3 shadow-md">
                        <span className="font-serif font-bold text-lg leading-none">D</span>
                    </div>
                    <h2 className="text-xl font-serif font-bold tracking-wide">DressAura</h2>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Management</p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="font-medium text-sm">{item.name}</span>
                                {isActive && (
                                    <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-8 bg-black rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => {
                            useAuthStore.getState().logout();
                            router.push('/admin/login');
                        }}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium text-sm group"
                    >
                        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600" strokeWidth={2} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg w-96 border border-gray-200 focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all">
                        <Search className="w-4 h-4 text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Search orders, customers, or products..."
                            className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder-gray-400"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-900">{user?.name || 'Administrator'}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-tr from-gray-900 to-gray-700 rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white ring-2 ring-gray-100">
                                <span className="font-serif font-bold text-sm">{(user?.name || 'A')[0].toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB]">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
