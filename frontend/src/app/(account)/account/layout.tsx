'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogOut, Package, MapPin, LayoutDashboard, UserCircle } from 'lucide-react';

const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: UserCircle },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Wait for Zustand to finish loading from localStorage
        const checkHydration = setInterval(() => {
            if (useAuthStore.persist.hasHydrated()) {
                setMounted(true);
                clearInterval(checkHydration);
            }
        }, 50);
        return () => clearInterval(checkHydration);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router, mounted]);

    // Handle initial routing matching the URL
    useEffect(() => {
        const path = window.location.pathname;
        if (path === '/account') setActiveTab('dashboard');
        else if (path.includes('/account/orders')) setActiveTab('orders');
        else if (path.includes('/account/addresses')) setActiveTab('addresses');
        else if (path.includes('/account/profile')) setActiveTab('profile');
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!mounted || !isAuthenticated) return null; // Prevent SSR flash or auth bypass

    return (
        <div className="bg-[#fafaf9] min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-10 px-4 text-center">
                <h1 className="text-3xl font-serif font-black text-gray-900 tracking-tight">My Account</h1>
                <p className="text-sm text-gray-500 mt-2">Manage your orders and preferences</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 flex flex-col md:flex-row gap-8">

                {/* ── Left Sidebar Navigation ── */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden flex flex-col">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const href = tab.id === 'dashboard' ? '/account' : `/account/${tab.id}`;
                            return (
                                <Link
                                    key={tab.id}
                                    href={href}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-colors border-l-4 ${isActive
                                            ? 'bg-gray-50 text-gray-900 border-black'
                                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-black' : 'text-gray-400'} />
                                    {tab.label}
                                </Link>
                            );
                        })}
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-6 py-4 text-sm font-semibold text-rose-600 border-l-4 border-transparent hover:bg-rose-50 transition-colors w-full text-left"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </nav>
                </aside>

                {/* ── Right Content Area ── */}
                <main className="flex-1 bg-white shadow-sm border border-gray-100 rounded-sm p-6 md:p-10 min-h-[500px]">
                    {children}
                </main>
            </div>
        </div>
    );
}
