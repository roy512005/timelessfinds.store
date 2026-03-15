'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MapPickerWrapper from '@/components/ui/MapPickerWrapper';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, clearCart, removeItemLocally } = useCartStore();
    const { user } = useAuthStore();

    const [hydrated, setHydrated] = useState(false);
    const { settings, fetchSettings } = useSettingsStore();

    useEffect(() => { 
        setHydrated(true); 
    }, []);

    useEffect(() => {
        if (!settings) fetchSettings();
    }, [settings, fetchSettings]);

    const [step, setStep] = useState(1); // 1 = Address, 2 = Delivery, 3 = Payment, 4 = Success
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState('');

    // Shipping Form
    const [form, setForm] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: (user as any)?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        saveAddress: false,
        useAsDefault: false,
    });
    const [selectedSavedAddress, setSelectedSavedAddress] = useState<string | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(!user);
    const [showMapPicker, setShowMapPicker] = useState(false);

    // Delivery & Payment
    const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'netbanking' | 'wallet'>('card');

    // Coupon
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    // Fetch saved addresses if logged in
    const { data: addressData } = useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            const { data } = await api.get('/users/address');
            return data;
        },
        enabled: !!user,
    });
    const addresses = addressData?.addresses || addressData || [];

    useEffect(() => {
        if (addressData) { // Wait for addresses to load (even if empty)
            if (addresses.length > 0) {
                if (!selectedSavedAddress) {
                    setSelectedSavedAddress(addresses[0]._id);
                    setShowNewAddressForm(false);
                    const addr = addresses[0];
                    setForm(f => ({
                        ...f,
                        addressLine1: addr.address_line1 || '',
                        city: addr.city || '',
                        pincode: addr.postal_code || '',
                    }));
                }
            } else if (user) {
                // Logged in but no addresses found: show the form immediately
                setShowNewAddressForm(true);
            }
        }
    }, [addresses, addressData, selectedSavedAddress, user]);

    // Calculate Totals
    const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
    const freeShippingThreshold = settings?.freeShippingThreshold || 999;
    const standardShippingCost = subtotal > freeShippingThreshold ? 0 : 99;
    const shippingCost = deliveryMethod === 'express' ? 99 : standardShippingCost;
    const total = subtotal + shippingCost - discount;

    // PIN Code auto-fill mockup
    useEffect(() => {
        if (form.pincode.length === 6) {
            if (form.pincode.startsWith('400')) {
                setForm(f => ({ ...f, city: 'Mumbai', state: 'Maharashtra' }));
            } else if (form.pincode.startsWith('110')) {
                setForm(f => ({ ...f, city: 'New Delhi', state: 'Delhi' }));
            }
        }
    }, [form.pincode]);

    // Apply Coupon
    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode) return;
        try {
            const { data } = await api.post('/coupons/apply', { code: couponCode, cartTotal: subtotal });
            if (data && data.success) {
                setDiscount(data.discount);
                toast.success(`Coupon applied! ₹${data.discount} off`);
                // Clear state if any on discount error before recalculating
            } else {
                toast.error('Failed to apply coupon');
                setDiscount(0);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid coupon code');
            setDiscount(0);
        }
    };

    // Create Order
    const createOrderMutation = useMutation({
        mutationFn: async () => {
            const orderItems = items.map(item => ({
                product: item._id,
                product_variant_id: item.product_variant_id,
                quantity: item.quantity || 1,
                price: item.price || 0,
                size: item.size || 'M',
                name: item.name,
                image: item.image
            }));

            // Use our mock backend format if available
            const payload: any = {
                orderItems: items.map((i: any) => ({
                    title: i.title || i.name,
                    qty: i.quantity || 1,
                    image: i.img || i.image,
                    price: i.price,
                    product: i.id || (i as any)._id
                })),
                shippingAddress: {
                    name: `${form.firstName} ${form.lastName}`.trim(),
                    phone: form.phone,
                    address_line1: form.addressLine1,
                    city: form.city,
                    postal_code: form.pincode,
                    country: form.country
                },
                paymentMethod: paymentMethod,
                totalPrice: total,
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice: shippingCost,
            };

            if (user) {
                const { data } = await api.post('/orders', payload);
                return data;
            } else {
                const { data } = await api.post('/orders/guest', payload);
                return data;
            }
        },
        onSuccess: (data) => {
            setOrderId(data?.order?._id || data?._id || `ORD${Math.floor(Math.random() * 899999 + 100000)}`);
            clearCart();
            setStep(4);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
            setIsProcessing(false);
        }
    });

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        if (!form.addressLine1 || !form.city || !form.pincode || !form.firstName || !form.phone) {
            toast.error('Please fill all required shipping details');
            setStep(1);
            return;
        }

        setIsProcessing(true);

        if (paymentMethod === 'cod') {
            createOrderMutation.mutate();
            return;
        }

        // Razorpay flow for digital payments
        const res = await loadRazorpay();
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            setIsProcessing(false);
            return;
        }

        try {
            // 1. Create order on our backend Server
            const { data: paymentIntent } = await api.post('/payment/create', { totalAmount: total });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_fake_key_id',
                amount: paymentIntent.amount,
                currency: "INR",
                name: "DressAura",
                description: "Luxury Dress Purchase",
                order_id: paymentIntent.id,
                handler: async function (response: any) {
                    try {
                        const verifyResult = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyResult.data.status === 'success') {
                            toast.success('Payment verified successfully!');
                            createOrderMutation.mutate();
                        } else {
                            toast.error('Payment verification failed');
                            setIsProcessing(false);
                        }
                    } catch (e: any) {
                        toast.error(e.response?.data?.message || 'Verification Error');
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: `${form.firstName} ${form.lastName}`.trim(),
                    email: form.email,
                    contact: form.phone
                },
                theme: {
                    color: "#000000"
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.on('payment.failed', function (response: any) {
                toast.error('Payment failed or cancelled.');
                setIsProcessing(false);
            });
            paymentObject.open();

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to initiate payment.');
            setIsProcessing(false);
        }
    };


    /* ── SUCCESS PAGE ───────────────────────────────────────── */
    if (step === 4) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#fafaf9]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 max-w-lg w-full text-center"
                >
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>

                    <h1 className="text-3xl font-serif font-black text-gray-900 mb-2">Order Placed Successfully 🎉</h1>
                    <p className="text-gray-500 mb-6 text-sm">We have received your order and are getting it ready.</p>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm mb-8 text-left space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Order ID</span>
                            <span className="text-gray-900 font-bold">#{orderId.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Est. Delivery</span>
                            <span className="text-gray-900 font-bold">{deliveryMethod === 'express' ? '1-2 Days' : '3-5 Days'}</span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mb-8">We've sent a confirmation to {form.phone} {form.email && `and ${form.email}`}.</p>

                    <div className="flex gap-4 justify-center">
                        <Link href="/track-order">
                            <button className="px-6 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">
                                Track Order
                            </button>
                        </Link>
                        <Link href="/">
                            <button className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!hydrated) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh]">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 text-sm uppercase tracking-widest">Loading checkout…</p>
            </div>
        );
    }

    if (items.length === 0 && step !== 4) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#fafaf9]">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-gray-100">
                    <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your bag is empty</h2>
                <p className="text-gray-500 mb-8">Add some items before checking out.</p>
                <Link href="/dresses" className="bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors">
                    Shop Dresses
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">

            {/* Header */}
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-gray-100 gap-4">
                <h1 className="text-3xl font-serif font-black text-gray-900 tracking-tight">Checkout</h1>
                {!user && (
                    <div className="text-sm">
                        <span className="text-gray-500">Checkout as Guest OR </span>
                        <Link href="/login" className="text-black font-bold uppercase tracking-widest text-xs hover:text-rose-600">Login</Link>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                {/* ── LEFT SIDE: FORMS ────────────────────────────────────────── */}
                <div className="flex-1 space-y-10">

                    {/* STEP 1: SHIPPING ADDRESS */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${step === 1 ? 'bg-black text-white' : 'bg-green-100 text-green-700'}`}>
                                {step > 1 ? '✓' : '1'}
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 text-sm">Shipping Address</h2>
                        </div>

                        {step === 1 ? (
                            <div className="pl-9 animate-in fade-in slide-in-from-top-4 duration-300">
                                {user && addresses.length > 0 && (
                                    <div className="mb-6 space-y-3">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Saved Addresses</p>
                                        <div className="grid gap-3">
                                            {addresses.map((addr: any) => (
                                                <label key={addr._id} className={`flex items-start p-4 border cursor-pointer transition-colors ${selectedSavedAddress === addr._id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <input
                                                        type="radio"
                                                        name="savedAddress"
                                                        className="mt-1 accent-black"
                                                        checked={selectedSavedAddress === addr._id && !showNewAddressForm}
                                                        onChange={() => {
                                                            setSelectedSavedAddress(addr._id);
                                                            setShowNewAddressForm(false);
                                                            setForm(f => ({ ...f, addressLine1: addr.address_line1 || '', city: addr.city || '', pincode: addr.postal_code || '' }));
                                                        }}
                                                    />
                                                    <div className="ml-3 text-sm">
                                                        <span className="font-bold text-gray-900 block">{addr.name || user.name}</span>
                                                        <span className="text-gray-500">{addr.address_line1}, {addr.city}, {addr.postal_code}</span>
                                                    </div>
                                                </label>
                                            ))}
                                            <button
                                                className={`text-left p-4 border text-sm font-bold transition-colors ${showNewAddressForm ? 'border-black bg-gray-50' : 'border-dashed border-gray-300 text-gray-500 hover:border-gray-400'}`}
                                                onClick={() => setShowNewAddressForm(true)}
                                            >
                                                + Add New Address
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {showNewAddressForm && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">First Name *</label>
                                                <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none bg-white" required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Last Name *</label>
                                                <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none bg-white" required />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Phone Number *</label>
                                                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none bg-white" required placeholder="+91" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Email <span className="lowercase normal-case tracking-normal">(optional)</span></label>
                                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none bg-white" />
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Delivering To *</label>
                                            <button
                                                type="button"
                                                onClick={() => setShowMapPicker(true)}
                                                className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors flex items-center rounded-sm"
                                            >
                                                📍 Select on Map
                                            </button>
                                        </div>
                                        <div>
                                            <input type="text" value={form.addressLine1} onChange={e => setForm({ ...form, addressLine1: e.target.value })} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none bg-white" required placeholder="House/Flat No., Building Name, Street" />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Address Line 2 <span className="lowercase normal-case tracking-normal">(optional)</span></label>
                                            <input type="text" value={form.addressLine2} onChange={e => setForm({ ...form, addressLine2: e.target.value })} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none bg-white" placeholder="Landmark, Area, etc." />
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Pincode *</label>
                                                <input type="text" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none bg-white" required maxLength={6} />
                                            </div>
                                            <div className="col-span-1 border-gray-200">
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">City *</label>
                                                <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none bg-white" required />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">State *</label>
                                                <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none bg-white" required />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Country *</label>
                                                <input type="text" value={form.country} disabled className="w-full border border-gray-200 px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                                            </div>
                                        </div>

                                        {user && (
                                            <div className="flex flex-col gap-2 mt-4 text-xs font-medium text-gray-700">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={form.saveAddress} onChange={e => setForm({ ...form, saveAddress: e.target.checked })} className="accent-black w-3.5 h-3.5" />
                                                    Save this address for next time
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={form.useAsDefault} onChange={e => setForm({ ...form, useAsDefault: e.target.checked })} className="accent-black w-3.5 h-3.5" />
                                                    Use as default address
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        if (!showNewAddressForm && selectedSavedAddress) {
                                            setStep(2);
                                        } else {
                                            if (!form.firstName || !form.phone || !form.addressLine1 || !form.city || !form.pincode) {
                                                toast.error('Please fill all required fields');
                                                return;
                                            }
                                            setStep(2);
                                        }
                                    }}
                                    className="mt-6 bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                                >
                                    Continue to Delivery
                                </button>
                            </div>
                        ) : (
                            <div className="pl-9 flex justify-between items-center text-sm">
                                <span className="text-gray-500">{form.firstName} {form.lastName}, {form.addressLine1}, {form.city}</span>
                                <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest underline hover:text-rose-600">Edit</button>
                            </div>
                        )}
                    </section>


                    {/* STEP 2: DELIVERY METHOD */}
                    <section className={step < 2 ? 'opacity-40 pointer-events-none' : ''}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${step === 2 ? 'bg-black text-white' : step > 2 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                {step > 2 ? '✓' : '2'}
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 text-sm">Delivery Method</h2>
                        </div>

                        {step === 2 ? (
                            <div className="pl-9 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="grid gap-4">
                                    <label className={`flex items-start justify-between p-4 border cursor-pointer transition-colors ${deliveryMethod === 'standard' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="accent-black mt-0.5" />
                                            <div>
                                                <span className="font-bold text-gray-900 block text-sm">Standard Delivery</span>
                                                <span className="text-xs text-gray-500">Delivery by {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} (3-5 Days)</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm text-gray-900">
                                            {standardShippingCost === 0 ? 'FREE' : `₹${standardShippingCost}`}
                                        </span>
                                    </label>

                                    <label className={`flex items-start justify-between p-4 border cursor-pointer transition-colors ${deliveryMethod === 'express' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="accent-black mt-0.5" />
                                            <div>
                                                <span className="font-bold text-gray-900 block text-sm">Express Delivery</span>
                                                <span className="text-xs text-gray-500">Delivery by {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} (1-2 Days)</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm text-gray-900">+₹99</span>
                                    </label>
                                </div>
                                <button onClick={() => setStep(3)} className="mt-6 bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                    Continue to Payment
                                </button>
                            </div>
                        ) : step > 2 && (
                            <div className="pl-9 flex justify-between items-center text-sm">
                                <span className="text-gray-500 capitalize">{deliveryMethod} Delivery ({deliveryMethod === 'standard' && standardShippingCost === 0 ? 'Free' : `₹${shippingCost}`})</span>
                                <button onClick={() => setStep(2)} className="text-[10px] font-bold uppercase tracking-widest underline hover:text-rose-600">Edit</button>
                            </div>
                        )}
                    </section>


                    {/* STEP 3: PAYMENT METHOD */}
                    <section className={step < 3 ? 'opacity-40 pointer-events-none' : ''}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${step === 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                3
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 text-sm">Payment Method</h2>
                        </div>

                        {step === 3 && (
                            <div className="pl-9 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="text-xs text-gray-400 mb-4 bg-gray-50 p-3 flex gap-2 rounded-sm border border-gray-100">
                                    🔒 All transactions are secure and encrypted.
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { id: 'upi', label: 'UPI / QR', desc: 'Google Pay, PhonePe, Paytm' },
                                        { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, Amex via Razorpay' },
                                        { id: 'netbanking', label: 'Net Banking', desc: 'All major Indian banks' },
                                        { id: 'wallet', label: 'Wallets', desc: 'Mobikwik, Freecharge' },
                                        { id: 'cod', label: 'Cash on Delivery', desc: 'Pay cash upon receipt' },
                                    ].map(method => (
                                        <label key={method.id} className={`block p-4 border cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id as any)} className="accent-black mt-0.5" />
                                                <div>
                                                    <span className="font-bold text-gray-900 block text-sm">{method.label}</span>
                                                    <span className="text-xs text-gray-500">{method.desc}</span>
                                                </div>
                                            </div>
                                            {/* Dummy Card Input if Card Selected */}
                                            {paymentMethod === 'card' && method.id === 'card' && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="space-y-3">
                                                        <input type="text" placeholder="Card Number" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                                                            <input type="text" placeholder="CVV" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                                                        </div>
                                                        <input type="text" placeholder="Cardholder Name" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                                                    </div>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* ── RIGHT SIDE: ORDER SUMMARY ─────────────────────────────── */}
                <div className="lg:w-[420px] shrink-0">
                    <div className="bg-gray-50 p-6 md:p-8 rounded-sm border border-gray-100 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 font-serif">Order Summary</h2>

                        {/* Product List */}
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                            {items.map((item, idx) => (
                                <div key={`${item._id}-${idx}`} className="flex gap-4">
                                    <div className="w-20 h-28 bg-gray-200 relative shrink-0">
                                        <img src={item.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80"} alt={item.name} className="w-full h-full object-cover" />
                                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                                            {item.quantity || 1}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{item.name}</h4>

                                            {/* Size Confirmation (Psychology Request) */}
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">Size: <span className="font-bold text-gray-900">{item.size || 'M'}</span></span>
                                                <span className="text-gray-300">|</span>
                                                <button className="text-[10px] uppercase tracking-widest text-gray-500 underline hover:text-rose-600">Change</button>
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Section */}
                        <div className="mb-6 border-y border-gray-200 py-6">
                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value)}
                                    placeholder="Enter Code (try AURA500)"
                                    className="flex-1 border border-gray-300 px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black uppercase bg-white"
                                />
                                <button type="submit" className="bg-gray-900 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors">
                                    Apply
                                </button>
                            </form>
                        </div>

                        {/* Price Details */}
                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                {shippingCost === 0 ? (
                                    <span className="text-green-600 font-bold">FREE</span>
                                ) : (
                                    <span>₹{shippingCost}</span>
                                )}
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-rose-600 font-bold">
                                    <span>Discount (AURA500)</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-end border-t border-gray-200 pt-5 mb-8">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-900">Total</span>
                            <span className="text-2xl font-black text-gray-900">₹{total.toLocaleString()}</span>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handlePlaceOrder}
                            disabled={step < 3 || isProcessing || createOrderMutation.isPending}
                            className="w-full h-14 bg-black text-white text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600 shadow-xl"
                        >
                            {(isProcessing || createOrderMutation.isPending) ? 'Processing Payment...' : 'Place Order'}
                        </button>

                        <p className="text-[10px] text-center text-gray-400 mt-4 px-2">
                            By placing your order, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {showMapPicker && (
                    <MapPickerWrapper
                        onClose={() => setShowMapPicker(false)}
                        onSelectAddress={(addr) => setForm(f => ({ ...f, ...addr, addressLine2: '' }))}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
