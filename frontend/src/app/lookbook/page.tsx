'use client';

import { motion } from 'framer-motion';

const LOOKS = [
    { id: 1, title: 'Summer Midnight', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1600&q=80', description: 'Flowing silk for warm evenings.' },
    { id: 2, title: 'The Architect', img: 'https://images.unsplash.com/photo-1543165259-ee4ea24dfc08?w=1600&q=80', description: 'Structured silhouettes and bold lines.' },
    { id: 3, title: 'Garden Party', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1600&q=80', description: 'Florals redefined with dramatic volume.' },
    { id: 4, title: 'Minimalist Muse', img: 'https://images.unsplash.com/photo-1434389678232-04e38e8ec402?w=1600&q=80', description: 'Less is always more.' },
    { id: 5, title: 'Urban Elegance', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80', description: 'City-ready pieces that turn heads.' },
    { id: 6, title: 'Sunset Glow', img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1600&q=80', description: 'Capturing the golden hour in fabric.' },
];

export default function LookbookPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="max-w-[1400px] mx-auto px-6">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">Our Lookbook</h1>
                    <p className="text-gray-500 max-w-lg mx-auto uppercase tracking-widest text-sm leading-relaxed">
                        Explore styling inspiration from our latest collections and editorial shoots.
                    </p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {LOOKS.map((look, idx) => (
                        <motion.div
                            key={look.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx % 3 * 0.1 }}
                            className="break-inside-avoid relative group overflow-hidden bg-gray-100"
                        >
                            <img
                                src={look.img}
                                alt={look.title}
                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-6">
                                <h3 className="text-white font-serif text-2xl mb-2">{look.title}</h3>
                                <p className="text-white/80 text-sm">{look.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
