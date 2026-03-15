import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1549439602-43ebca2327af?w=1600&q=80"
                    alt="Brand Heritage"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="relative z-20 text-center px-4 max-w-3xl mt-16">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-md">Our Story</h1>
                    <p className="text-white/90 text-lg uppercase tracking-widest font-medium">Elegance, Redefined.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-24">
                <div className="prose prose-lg text-gray-700 mx-auto text-center font-serif leading-relaxed">
                    <p className="text-2xl text-gray-900 mb-12 italic">
                        "Our dresses are designed to celebrate elegance, confidence, and modern femininity."
                    </p>

                    <p className="mb-8">
                        Founded with a vision to bring timeless luxury to the modern wardrobe, Timeless Finds is more than a boutique—it is a celebration of the feminine form. We believe that a dress is not just fabric; it is an armor of confidence, a canvas for self-expression, and a memory waiting to unfold.
                    </p>

                    <p className="mb-8">
                        Every piece in our collection is curated with an obsessive attention to detail. From the drape of heavy silk to the delicate touch of hand-placed applique, we ensure that every garment passing through our doors meets the highest standards of craftsmanship.
                    </p>

                    <p>
                        We do not follow fleeting trends. We curate classics. Welcome to the new era of timeless fashion.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24 text-center">
                    <div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-4">Integrity</h3>
                        <p className="text-sm text-gray-500">Ethically sourced materials and conscious craftsmanship.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-4">Exclusivity</h3>
                        <p className="text-sm text-gray-500">Strictly limited production runs to ensure your individuality.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-4">Excellence</h3>
                        <p className="text-sm text-gray-500">Uncompromising quality control for garments that last generations.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
