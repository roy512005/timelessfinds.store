'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async () => {
            const { data } = await api.post('/auth/login', { email, password });
            return data;
        },
        onSuccess: (data) => {
            // Store user + token in Zustand
            login(data.user, data.token);

            const role = data.user?.role;

            // Role-based redirect
            if (role === 'admin') {
                toast.success(`Welcome back, Admin ${data.user.name}!`);
                router.push('/admin');
            } else if (role === 'staff') {
                toast.success(`Welcome back, ${data.user.name}!`);
                router.push('/staff');
            } else {
                toast.success('Welcome back to Timeless Finds.');
                router.push('/');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Invalid email or password. Please try again.');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        mutation.mutate();
    };

    return (
        <div className="min-h-[80vh] flex flex-col md:flex-row items-stretch bg-white">
            {/* Left visual panel */}
            <div className="hidden md:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"
                    alt="Luxury Dress"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="relative z-20 text-center p-12 max-w-lg">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                        <span className="text-white text-2xl">✦</span>
                    </div>
                    <h2 className="text-4xl font-serif text-white mb-4 drop-shadow-lg">Timeless Finds</h2>
                    <p className="text-white/80 text-base drop-shadow-md">
                        Secure access to the DressAura administrative dashboard.
                    </p>
                    <div className="mt-8 flex justify-center gap-6 text-white/60 text-xs uppercase tracking-widest font-bold">
                        <span>Admin Portal</span>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">Admin Authentication</h1>
                        <p className="text-gray-500 mb-8 text-sm">
                            Please sign in with your administrator credentials.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="admin-email-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                                <input
                                    type="password"
                                    name="admin-password-field"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-black text-white py-4 rounded-lg text-sm tracking-widest font-bold uppercase transition-transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

