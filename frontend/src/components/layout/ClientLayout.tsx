'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const { isAuthenticated } = useAuthStore();
    const fetchCart = useCartStore((state) => state.fetchCart);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    if (isAdmin) {
        return <main className="min-h-screen bg-white">{children}</main>;
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {children}
            </main>
            <Footer />
        </>
    );
}

