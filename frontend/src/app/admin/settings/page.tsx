'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Settings, Store, Truck, Percent, Bell } from 'lucide-react';

const INITIAL_SETTINGS = {
    storeName: 'DressAura',
    storeLogo: '',
    currency: 'INR',
    freeShippingAbove: 999,
    deliveryCharge: 50,
    taxRate: 5,
    deliveryAreas: 'All India',
    notificationEmail: '',
    notificationSMS: false,
    notificationPush: false,
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState(INITIAL_SETTINGS);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // In production this would call PUT /api/admin/settings
        setSaved(true);
        toast.success('Settings saved successfully!');
        setTimeout(() => setSaved(false), 2000);
    };

    const update = (key: string, value: any) => setSettings(p => ({ ...p, [key]: value }));

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <Settings className="w-8 h-8 text-gray-600" /> Store Settings
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Configure your store preferences and operational settings.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                >
                    {saved ? '✓ Saved!' : 'Save Settings'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Store Identity */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b">
                        <Store className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-bold text-gray-900">Store Identity</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Store Name</label>
                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                value={settings.storeName} onChange={e => update('storeName', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Store Logo URL</label>
                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                value={settings.storeLogo} onChange={e => update('storeLogo', e.target.value)} placeholder="https://yourlogo.png" type="url" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Currency</label>
                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                value={settings.currency} onChange={e => update('currency', e.target.value)}>
                                <option value="INR">₹ Indian Rupee (INR)</option>
                                <option value="USD">$ US Dollar (USD)</option>
                                <option value="EUR">€ Euro (EUR)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Shipping & Tax */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b">
                        <Truck className="w-5 h-5 text-blue-500" />
                        <h2 className="font-bold text-gray-900">Shipping & Tax</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Free Shipping Above (₹)</label>
                            <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                value={settings.freeShippingAbove} onChange={e => update('freeShippingAbove', Number(e.target.value))} />
                            <p className="text-xs text-gray-400 mt-1">Free shipping above ₹{settings.freeShippingAbove}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Base Delivery Charge (₹)</label>
                            <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                value={settings.deliveryCharge} onChange={e => update('deliveryCharge', Number(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Tax Rate (%)</label>
                            <input type="number" step="0.1" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                value={settings.taxRate} onChange={e => update('taxRate', Number(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Delivery Areas</label>
                            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                                rows={2} value={settings.deliveryAreas} onChange={e => update('deliveryAreas', e.target.value)}
                                placeholder="e.g. All India, or list specific states/cities" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
