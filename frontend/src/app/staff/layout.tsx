'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useStore((state) => state.user);
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'admin' && user.role !== 'staff') {
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [user, router]);

    if (!isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-serif">Checking permissions...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            {/* Sidebar Component would go here */}
            <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
                <h2 className="text-2xl font-serif font-bold mb-8 text-amber-500">Staff Portal</h2>
                <nav className="flex flex-col space-y-4 text-sm font-medium tracking-wide">
                    <Link href="/staff" className="hover:text-amber-400">Dashboard</Link>
                    <Link href="/staff/orders" className="hover:text-amber-400">Orders</Link>
                    <Link href="/staff/inventory" className="hover:text-amber-400">Inventory</Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
