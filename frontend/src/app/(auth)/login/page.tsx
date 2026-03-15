'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import api from '@/lib/axios';

function LoginContent() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMockMode, setIsMockMode] = useState(false);
    const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);

    const login = useAuthStore((state) => state.login);
    const updateUser = useAuthStore((state) => state.updateUser);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    useEffect(() => {
        // 1️⃣ Initialize reCAPTCHA Before Sending OTP
        // Only initialize it globally if we have a real Firebase configuration.
        // It's best practice to initialize this on mount so the invisibility challenge
        // is ready the moment the user taps "Send OTP".
        if (auth && !(auth as any).dummy) {
            if (!(window as any).recaptchaVerifier) {
                try {
                    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        size: 'invisible',
                    });
                } catch (err) {
                    console.error("Recaptcha Initialization Error:", err);
                }
            }
        }
    }, []);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        // Test number logic to save SMS logic/money during development
        if (phone === '9999999999') {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setStep(2);
                toast.success('Test OTP activated 123456');
            }, 600);
            return;
        }

        setIsLoading(true);
        try {
            if (!(window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    size: 'invisible',
                });
            }
            const appVerifier = (window as any).recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
            setConfirmResult(result);
            setStep(2);
            toast.success('OTP sent to your phone');
        } catch (error: any) {
            console.error(error);
            const errMsg = error.message || '';

            // Seamlessly catch Firebase missing Billing setups and drop them intelligently into Mock mode so they aren't completely blocked from testing!
            if (errMsg.includes('BILLING_NOT_ENABLED') || errMsg.includes('invalid API key')) {
                setIsMockMode(true);
                setStep(2);
                toast.success('Firebase Billing Disabled. Mock OTP (123456) activated!');
            } else {
                toast.error(errMsg || 'Failed to send OTP. Try again.');
                // Reset Recaptcha on normal errors
                if ((window as any).recaptchaVerifier) {
                    (window as any).recaptchaVerifier.clear();
                    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        size: 'invisible',
                    });
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) {
            toast.error('Please enter the complete OTP');
            return;
        }

        setIsLoading(true);

        try {
            if (phone === '9999999999' || isMockMode) {
                if (otp !== '123456') throw new Error("Invalid Test OTP");
            } else {
                if (!confirmResult) {
                    throw new Error("OTP confirmation result missing.");
                }
                const result = await confirmResult.confirm(otp);
            }

            // Successfully verified phone locally using Firebase. Now connect to Backend.
            const res = await api.post('/auth/phone-login', { phone });

            const userData = res.data.user;
            const token = res.data.token;

            toast.success('Login Successful');
            login(userData, token);
            await useCartStore.getState().fetchCart();

            // If the user name is the default generated one, they are technically new, prompt for Registration Form (Step 3)
            if (userData.name.startsWith('User_')) {
                setStep(3);
            } else {
                router.push(redirectTo);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast.error('Name is required');
            return;
        }
        setIsLoading(true);

        try {
            // Update Profile on Backend
            const res = await api.put('/users/me', { name, email });
            updateUser({ name: res.data.name, email: res.data.email });

            toast.success('Profile created successfully!');
            router.push(redirectTo);
        } catch (error) {
            toast.error('Failed to update profile details');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-[#fafaf9] px-4 py-12">
            <div id="recaptcha-container"></div>

            <div className="max-w-md w-full">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <h1 className="text-3xl font-serif font-black text-gray-900 tracking-tight cursor-pointer">
                            DressAura
                        </h1>
                    </Link>
                    <p className="text-gray-500 mt-2 text-sm">
                        Sign in or create an account to unlock exclusive benefits.
                    </p>
                </div>

                {/* Card Component */}
                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 min-h-[360px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {/* ── STEP 1: PHONE NUMBER ── */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-gray-900">Welcome</h2>
                                    <p className="text-sm text-gray-500 mt-1">Enter your phone number to continue</p>
                                </div>

                                <form onSubmit={handleSendOTP} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">Phone Number</label>
                                        <div className="flex border border-gray-300 focus-within:border-black transition-colors rounded-sm overflow-hidden bg-white">
                                            <span className="flex items-center justify-center px-4 bg-gray-50 border-r border-gray-300 text-gray-600 font-medium">
                                                +91
                                            </span>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                placeholder="99999 99999"
                                                className="w-full px-4 py-3 focus:outline-none text-gray-900 font-medium tracking-wide"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || phone.length < 10}
                                        className="w-full bg-black text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:hover:bg-black"
                                    >
                                        {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                </form>

                                <div className="mt-6 text-center text-xs text-gray-400">
                                    By continuing, you agree to our <Link href="/terms" className="underline hover:text-gray-900">Terms of Service</Link> & <Link href="/privacy-policy" className="underline hover:text-gray-900">Privacy Policy</Link>.
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 2: OTP ── */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-gray-900">Verify Phone</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Enter the code sent to <span className="font-bold text-gray-900">+91 {phone}</span>
                                    </p>
                                    <button onClick={() => setStep(1)} type="button" className="text-rose-600 text-xs font-bold hover:underline mt-2">
                                        Not your number? Edit
                                    </button>
                                </div>

                                <form onSubmit={handleVerifyOTP} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-900 mb-2 text-center">6-Digit Code</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="• • • • • •"
                                            className="w-full border border-gray-300 focus:border-black rounded-sm px-4 py-4 text-center text-2xl tracking-[0.5em] focus:outline-none transition-colors"
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || otp.length < 4}
                                        className="w-full bg-black text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:hover:bg-black"
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                                    </button>
                                </form>

                                <div className="mt-6 text-center text-xs text-gray-500">
                                    Didn't receive code? <button type="button" onClick={handleSendOTP} className="font-bold text-gray-900 hover:text-rose-600 ml-1 cursor-pointer">Resend Code</button>
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 3: REGISTRATION ── */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-gray-900">Create Your Account</h2>
                                    <p className="text-sm text-gray-500 mt-1">Just a few more details to set up your profile.</p>
                                </div>

                                <form onSubmit={handleRegister} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">Name *</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Full Name"
                                            className="w-full border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:border-black transition-colors bg-white font-medium"
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone (Verified)</label>
                                        <input
                                            type="text"
                                            value={`+91 ${phone}`}
                                            className="w-full border border-gray-200 rounded-sm px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-900 items-baseline flex gap-2 mb-2">
                                            Email
                                            <span className="text-[10px] text-gray-400 normal-case tracking-normal font-normal bg-gray-100 px-1.5 py-0.5 rounded">(Optional)</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="For order updates & offers"
                                            className="w-full border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:border-black transition-colors bg-white"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !name}
                                        className="w-full bg-black text-white py-3.5 mt-2 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:hover:bg-black"
                                    >
                                        {isLoading ? 'Saving...' : 'Continue'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
