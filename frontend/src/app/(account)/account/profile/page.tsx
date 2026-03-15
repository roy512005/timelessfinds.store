'use client';

import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { UserCircle, Mail, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user, updateUser, token } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        saveMutation.mutate({ name, email });
    };

    const saveMutation = useMutation({
        mutationFn: async (payload: { name: string; email: string }) => {
            const { data } = await api.put('/user/profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        },
        onSuccess: () => {
            updateUser({ name, email });
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        },
        onError: () => toast.error('Failed to save profile. Please try again.')
    });

    if (!user) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl">
            <div>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-gray-900 tracking-tight">
                    Profile Settings
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                    Update your personal details below. Phone number modifications require re-verification.
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-sm p-6 sm:p-8">
                <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center relative overflow-hidden text-gray-400">
                        <UserCircle size={64} className="opacity-50" />
                        <div className="absolute inset-0 bg-black/5 hover:bg-black/20 transition-colors cursor-pointer flex items-center justify-center group">
                            <span className="text-white text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-xl text-gray-900">{user.name}</h3>
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1 mt-1">
                            <ShieldCheck size={14} className="text-green-500" />
                            {user.role} Account
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Phone (Immutable/Verified) */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            <Phone size={14} /> Registered Phone
                        </label>
                        <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden">
                            <span className="bg-gray-100 px-4 py-3 text-sm text-gray-500 border-r border-gray-200 cursor-not-allowed">
                                +91
                            </span>
                            <input
                                type="text"
                                value={user.phone?.replace('+91', '') || 'Unverified'}
                                disabled
                                className="flex-1 px-4 py-3 text-sm text-gray-700 font-medium cursor-not-allowed bg-gray-50/50"
                            />
                            <span className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50/30 flex items-center gap-1 border-l border-gray-200">
                                Verified ✔
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 ml-1">Phone numbers cannot be changed directly for security reasons.</p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            <UserCircle size={14} /> Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 text-sm rounded-sm transition-colors ${isEditing
                                ? 'bg-white border-black border-2 outline-none shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-700 cursor-default'
                                }`}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            <Mail size={14} /> Email Address <span className="text-[9px] font-normal tracking-normal text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full ml-1">(Optional)</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            placeholder="Used for order tracking and invoices"
                            className={`w-full px-4 py-3 text-sm rounded-sm transition-colors ${isEditing
                                ? 'bg-white border-black border-2 outline-none shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-700 cursor-default'
                                }`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saveMutation.isPending}
                                className="bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {saveMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-white border border-gray-200 text-gray-600 px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700 underline underline-offset-4">
                    Delete Account Permanently
                </button>
            </div>
        </div>
    );
}
