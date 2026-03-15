import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItemType {
    _id: string;
    product_id?: any;
    name?: string;
    price?: number;
    originalPrice?: number;
    image?: string;
}

interface WishlistState {
    items: WishlistItemType[];
    wishlist_id: string | null;
    setWishlist: (wishlistId: string, items: WishlistItemType[]) => void;
    addItemLocally: (item: WishlistItemType) => void;
    removeItemLocally: (itemId: string) => void;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set) => ({
            items: [],
            wishlist_id: null,
            setWishlist: (wishlist_id, items) => set({ wishlist_id, items }),
            addItemLocally: (item) =>
                set((state) => {
                    const existing = state.items.find(i =>
                        (i._id === item._id) ||
                        (i.product_id && item.product_id && i.product_id._id === item.product_id._id)
                    );
                    if (existing) return state;
                    return { items: [...state.items, item] };
                }),
            removeItemLocally: (itemId) =>
                set((state) => ({
                    items: state.items.filter((i) => i._id !== itemId),
                })),
            clearWishlist: () => set({ items: [], wishlist_id: null }),
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
