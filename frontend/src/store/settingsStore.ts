import { create } from 'zustand';
import api from '@/lib/axios';

interface StoreSettings {
    freeShippingThreshold: number;
    topBannerText: string;
    contactEmail: string;
    contactPhone: string;
    socialLinks: {
        instagram: string;
        facebook: string;
        twitter: string;
        youtube: string;
    };
    address: string;
}

interface SettingsState {
    settings: StoreSettings | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    isLoading: false,
    error: null,
    fetchSettings: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/home/settings');
            set({ settings: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
}));
