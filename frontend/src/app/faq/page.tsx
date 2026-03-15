'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    {
        category: 'Shipping & Delivery',
        items: [
            { q: 'What are your shipping times?', a: 'Domestic orders typically arrive within 3-5 business days. International shipping takes 7-14 business days depending on the destination. All orders are processed within 24 hours of confirmation.' },
            { q: 'Do you offer expedited shipping?', a: 'Yes, overnight and 2-day expedited options are available at checkout for domestic orders.' },
            { q: 'How can I track my order?', a: 'Once your order ships, you will receive an email with a tracking number. You can also visit our Track Order page and enter your order ID and email address.' }
        ]
    },
    {
        category: 'Returns & Exchanges',
        items: [
            { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery. Items must be unworn, unwashed, and have original tags attached. Custom or altered pieces are final sale.' },
            { q: 'How do I start a return?', a: 'Please navigate to our Returns Portal, enter your order number, and follow the instructions to print your prepaid return label.' },
            { q: 'Can I exchange for a different size?', a: 'Yes, direct exchanges are available for the same item in a different size or color, subject to availability.' }
        ]
    },
    {
        category: 'Product & Sizing',
        items: [
            { q: 'How do I know my size?', a: 'Please refer to our comprehensive Size Guide. If you are between sizes, we generally recommend sizing up for structured gowns and sizing down for stretch fabrics.' },
            { q: 'Do you offer alterations?', a: 'Currently, we do not offer in-house alterations, but our pieces are designed with generous seam allowances to allow your local tailor to easily make adjustments.' }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>('0-0');

    const toggleFaq = (idx: string) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="bg-gray-50/50 min-h-screen pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm leading-relaxed">
                        Find answers to common questions about shipping, returns, sizing, and more.
                    </p>
                </div>

                <div className="space-y-12">
                    {FAQS.map((section, sIdx) => (
                        <div key={section.category}>
                            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                                {section.category}
                            </h2>
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                {section.items.map((faq, iIdx) => {
                                    const id = `${sIdx}-${iIdx}`;
                                    const isOpen = openIndex === id;

                                    return (
                                        <div key={id} className="border-b border-gray-100 last:border-0 p-1">
                                            <button
                                                onClick={() => toggleFaq(id)}
                                                className="w-full text-left px-6 py-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                <span className={`text-sm font-bold leading-relaxed ${isOpen ? 'text-rose-600' : 'text-gray-900'}`}>
                                                    {faq.q}
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rose-600' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed text-sm">
                                                            {faq.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center border-t border-gray-200 pt-12">
                    <p className="text-gray-600 mb-4">Still need help?</p>
                    <a href="/contact" className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest rounded hover:bg-rose-600 transition-colors">
                        Contact Support
                    </a>
                </div>

            </div>
        </div>
    );
}
