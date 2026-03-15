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

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async () => {
            const { data } = await api.post('/auth/register', { name, email, password, phone });
            return data;
        },
        onSuccess: (data) => {
            login(data.user, data.token);
            toast.success('Welcome to the Timeless Finds family! 🎉');
            router.push('/profile');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !name) return;
        mutation.mutate();
    };

    return (
        <div className="min-h-[80vh] flex flex-col md:flex-row items-stretch bg-white">
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Join the Club</h1>
                        <p className="text-gray-500 mb-8">Create an account to track orders and save your favorites.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Eleanor Shellstrop"
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Used for WhatsApp order updates.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-black text-white py-4 rounded-md text-sm tracking-widest font-bold uppercase transition-transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 mt-4"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-black font-bold hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Visual Hook - Neuromarketing */}
            <div className="hidden md:flex w-1/2 bg-gray-50 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"
                    alt="Luxury Detail"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
                />
                <div className="relative z-20 text-center p-12 max-w-lg">
                    <h2 className="text-4xl font-serif text-white mb-6 drop-shadow-lg">A Wardrobe Reimagined</h2>
                    <p className="text-white/90 text-lg drop-shadow-md">Join over 10,000 women unlocking exclusive fashion archives and early-access privileges.</p>
                </div>
            </div>
        </div>
    );
}
