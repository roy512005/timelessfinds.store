'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Truck, User, LogOut, CheckCircle } from 'lucide-react';

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/delivery';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar / Bottom Nav */}
            <aside className="w-full md:w-64 bg-black text-white flex md:flex-col fixed bottom-0 md:static md:h-screen z-50">
                <div className="hidden md:block p-6 border-b border-gray-800">
                    <h1 className="text-xl font-serif font-black tracking-tight">DressAura <span className="text-rose-500">Rider</span></h1>
                </div>

                <nav className="flex-1 flex md:flex-col w-full px-2 py-3 md:p-4 gap-2 md:gap-4 overflow-x-auto justify-around md:justify-start">
                    <Link href="/delivery/dashboard" className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/delivery/dashboard' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <Package size={20} />
                        <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Dashboard</span>
                    </Link>
                    <Link href="/delivery/active" className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/delivery/active' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <Truck size={20} />
                        <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Active</span>
                    </Link>
                    <Link href="/delivery/completed" className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/delivery/completed' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <CheckCircle size={20} />
                        <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Done</span>
                    </Link>
                    <Link href="/delivery/profile" className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/delivery/profile' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <User size={20} />
                        <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Profile</span>
                    </Link>
                </nav>

                <div className="hidden md:block p-4 border-t border-gray-800">
                    <button onClick={() => { localStorage.removeItem('delivery-token'); window.location.href = '/delivery'; }} className="flex items-center gap-3 px-4 py-2 w-full text-gray-400 hover:text-rose-500 transition-colors">
                        <LogOut size={20} />
                        <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 pb-20 md:pb-0 h-screen overflow-y-auto">
                <Suspense fallback={<div className="p-8 h-full flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-black/20 border-t-black animate-spin" /></div>}>
                    {children}
                </Suspense>
            </main>
        </div>
    );
}
