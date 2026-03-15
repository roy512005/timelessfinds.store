'use client';

import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">Client Services</h1>
                    <p className="text-gray-500 max-w-lg mx-auto uppercase tracking-widest text-sm leading-relaxed">
                        We are here to assist you with styling advice, size recommendations, and order inquiries.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-16">

                    {/* Contact Info */}
                    <div className="md:w-1/3 space-y-12">
                        <div>
                            <div className="flex items-center space-x-3 mb-4 text-gray-900">
                                <Mail className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-widest text-sm">Email Us</h3>
                            </div>
                            <p className="text-gray-600 mb-2">For general inquiries and support:</p>
                            <a href="mailto:concierge@timelessfinds.com" className="font-bold text-rose-600 hover:text-rose-800 transition-colors">concierge@timelessfinds.com</a>
                        </div>

                        <div>
                            <div className="flex items-center space-x-3 mb-4 text-gray-900">
                                <Phone className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-widest text-sm">Call Us</h3>
                            </div>
                            <p className="text-gray-600 mb-2">Available Mon-Fri, 9am - 6pm EST:</p>
                            <a href="tel:+18001234567" className="font-bold text-gray-900 hover:text-rose-600 transition-colors">+1 (800) 123-4567</a>
                        </div>

                        <div>
                            <div className="flex items-center space-x-3 mb-4 text-gray-900">
                                <MapPin className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-widest text-sm">Flagship Boutique</h3>
                            </div>
                            <p className="text-gray-600">
                                123 Elegance Avenue<br />
                                Suite 400<br />
                                New York, NY 10012
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center space-x-3 mb-4 text-gray-900">
                                <Instagram className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-widest text-sm">Social</h3>
                            </div>
                            <p className="text-gray-600 mb-2">Tag us in your looks:</p>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="font-bold text-gray-900 hover:text-rose-600 transition-colors">@TimelessFinds_Official</a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:w-2/3 bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100">
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Send a Message</h3>
                        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">First Name</label>
                                    <input type="text" className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Last Name</label>
                                    <input type="text" className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Email Address</label>
                                <input type="email" className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Order Number (Optional)</label>
                                <input type="text" className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Message</label>
                                <textarea rows={4} className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none" />
                            </div>
                            <button className="w-full bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-rose-600 transition-colors rounded">
                                Submit Inquiry
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
