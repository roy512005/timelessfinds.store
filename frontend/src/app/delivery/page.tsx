'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryLogin() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
            const res = await fetch(`${apiUrl}/delivery/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');

            localStorage.setItem('delivery-token', data.token);
            toast.success(`Welcome back, ${data.deliveryBoy.name}`);
            router.push('/delivery/dashboard');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full p-8 shadow-xl rounded-2xl relative overflow-hidden border border-gray-100">
                <div className="absolute top-0 inset-x-0 h-1 bg-rose-500" />
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center rotate-3 shadow-inner">
                        <Truck size={32} className="-rotate-3" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif font-black text-gray-900 tracking-tight">Rider Login</h1>
                    <p className="text-gray-500 text-sm mt-1">DressAura Logistics Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                            placeholder="+91"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">PIN / Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3.5 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors mt-6 flex justify-center items-center gap-2 shadow-lg"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
