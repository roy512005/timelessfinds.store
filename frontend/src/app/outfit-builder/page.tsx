'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

// Mock data for outfit builder
const dresses = [
    { id: 1, name: 'Midnight Silk Slip', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80', price: 8500 },
    { id: 2, name: 'Crimson Velvet Gown', img: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400&q=80', price: 12000 },
];

const shoes = [
    { id: 1, name: 'Black Stilettos', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80', price: 4500 },
    { id: 2, name: 'Gold Strappy Heels', img: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400&q=80', price: 5200 },
];

const accessories = [
    { id: 1, name: 'Pearl Drop Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80', price: 2100 },
    { id: 2, name: 'Diamond Tennis Bracelet', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', price: 8900 },
];

export default function OutfitBuilderPage() {
    const [selectedDress, setSelectedDress] = useState(dresses[0]);
    const [selectedShoes, setSelectedShoes] = useState(shoes[0]);
    const [selectedAccessory, setSelectedAccessory] = useState(accessories[0]);
    const [isSpinning, setIsSpinning] = useState(false);

    const handleSpinToOutfit = () => {
        setIsSpinning(true);
        // Simulate a slot machine spin effect
        let counter = 0;
        const interval = setInterval(() => {
            setSelectedDress(dresses[Math.floor(Math.random() * dresses.length)]);
            setSelectedShoes(shoes[Math.floor(Math.random() * shoes.length)]);
            setSelectedAccessory(accessories[Math.floor(Math.random() * accessories.length)]);
            counter++;
            if (counter > 10) {
                clearInterval(interval);
                setIsSpinning(false);
            }
        }, 100);
    };

    const total = selectedDress.price + selectedShoes.price + selectedAccessory.price;
    const bundleDiscount = total * 0.15; // 15% off for full outfit
    const finalPrice = total - bundleDiscount;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-16">
                <span className="text-rose-600 font-bold tracking-widest text-xs uppercase mb-3 block animate-pulse">Investment Escalation</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Complete Your Aura</h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">Build your perfect look. Buying the complete outfit unlocks VIP pricing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Dynamic Canvas (Visual Dominance) */}
                <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                    <AnimatePresence mode="popLayout">
                        {/* Accessory Layer */}
                        <motion.div
                            key={`acc-${selectedAccessory.id}`}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute top-10 right-10 z-30 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl"
                        >
                            <Image src={selectedAccessory.img} alt={selectedAccessory.name} fill className="object-cover" />
                        </motion.div>

                        {/* Dress Layer */}
                        <motion.div
                            key={`dress-${selectedDress.id}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-[300px] h-[450px] z-20 shadow-2xl rounded-lg overflow-hidden border-8 border-white"
                        >
                            <Image src={selectedDress.img} alt={selectedDress.name} fill className="object-cover" />
                        </motion.div>

                        {/* Shoe Layer */}
                        <motion.div
                            key={`shoe-${selectedShoes.id}`}
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute bottom-10 -left-4 z-30 w-40 h-40 rounded-lg overflow-hidden border-4 border-white shadow-xl transform -rotate-6"
                        >
                            <Image src={selectedShoes.img} alt={selectedShoes.name} fill className="object-cover" />
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full shadow-lg">
                        Your Custom Look
                    </div>

                    {/* Section 2: Curiosity (Spin for an Outfit) */}
                    <div className="absolute bottom-4 right-4 z-40">
                        <Button
                            onClick={handleSpinToOutfit}
                            disabled={isSpinning}
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-full p-4 shadow-xl border-2 border-white animate-pulse"
                            aria-label="Spin for Outfit"
                        >
                            <span className="text-xl">🎲</span>
                        </Button>
                        <div className="absolute -top-8 -left-12 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded shadow-lg whitespace-nowrap">
                            Spin for Outfit
                        </div>
                    </div>
                </div>

                {/* Builder Controls (Commitment & Flow) */}
                <div className="flex flex-col space-y-10">

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">1. The Canvas (Dress)</h3>
                        <div className="flex space-x-4">
                            {dresses.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedDress(item)}
                                    className={`relative w-24 h-32 rounded-lg overflow-hidden border-2 transition-all ${selectedDress.id === item.id ? 'border-rose-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">2. The Foundation (Shoes)</h3>
                        <div className="flex space-x-4">
                            {shoes.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedShoes(item)}
                                    className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedShoes.id === item.id ? 'border-rose-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">3. The Sparkle (Accessories)</h3>
                        <div className="flex space-x-4">
                            {accessories.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedAccessory(item)}
                                    className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all ${selectedAccessory.id === item.id ? 'border-rose-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Value Calculation (Anchoring) */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-auto">
                        <h4 className="font-bold text-gray-900 mb-4">Your Custom Bundle</h4>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex justify-between"><span>{selectedDress.name}</span><span>₹{selectedDress.price.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>{selectedShoes.name}</span><span>₹{selectedShoes.price.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>{selectedAccessory.name}</span><span>₹{selectedAccessory.price.toLocaleString()}</span></div>
                        </div>
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-gray-400 line-through mb-1">
                                <span>Total Value</span><span>₹{total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-600 font-bold mb-4">
                                <span>Bundle Discount (15%)</span><span>-₹{bundleDiscount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-900 text-lg">Final Price</span>
                                <span className="text-3xl font-bold text-gray-900">₹{finalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <Button size="lg" className="w-full mt-6 text-lg h-14 bg-black hover:bg-rose-600 transition-colors shadow-xl">
                            Add Complete Look to Bag
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
