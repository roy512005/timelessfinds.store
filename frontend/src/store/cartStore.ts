import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { useAuthStore } from './authStore';

export interface CartItemType {
    _id: string;
    product_variant_id?: any;
    quantity: number;
    name?: string;
    price?: number;
    originalPrice?: number;
    image?: string;
    size?: string;
    cartItemId?: string;
}

interface CartState {
    items: CartItemType[];
    cart_id: string | null;
    setCart: (cartId: string, items: CartItemType[]) => void;
    addItemLocally: (item: CartItemType) => void;
    removeItemLocally: (itemId: string) => void;
    updateQuantityLocally: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    fetchCart: () => Promise<void>;
    hydrated: boolean;
    setHydrated: (val: boolean) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            cart_id: null,
            setCart: (cart_id: string | null, items: CartItemType[]) => set({ cart_id, items }),
            addItemLocally: async (item: CartItemType) => {
                set((state: CartState) => {
                    const existing = state.items.find((i: CartItemType) => {
                        const i_pid = i.product_variant_id && typeof i.product_variant_id === 'object' ? i.product_variant_id._id : i.product_variant_id;
                        const item_pid = item.product_variant_id && typeof item.product_variant_id === 'object' ? item.product_variant_id._id : item.product_variant_id;
                        
                        return (i._id === item._id) || 
                               (i_pid && item_pid && i_pid === item_pid) ||
                               (i_pid === item._id) ||
                               (i._id === item_pid);
                    });

                    if (existing) {
                        return {
                            items: state.items.map((i: CartItemType) => {
                                const i_pid = i.product_variant_id && typeof i.product_variant_id === 'object' ? i.product_variant_id._id : i.product_variant_id;
                                const item_pid = item.product_variant_id && typeof item.product_variant_id === 'object' ? item.product_variant_id._id : item.product_variant_id;
                                
                                const isMatch = (i._id === item._id) || 
                                               (i_pid && item_pid && i_pid === item_pid) ||
                                               (i_pid === item._id) ||
                                               (i._id === item_pid);

                                return isMatch ? { ...i, quantity: i.quantity + item.quantity } : i;
                            })
                        };
                    }
                    return { items: [...state.items, item] };
                });

                // Background Sync
                const user = useAuthStore.getState().user;
                if (user) {
                    try {
                        await api.post('/cart', {
                            product_variant_id: item._id, // item._id is the product ID
                            quantity: item.quantity
                        });
                        // After background sync, fetch the full cart to get the correct cartItemID
                        await get().fetchCart();
                    } catch (e) {
                        console.error('Failed to sync cart add', e);
                    }
                }
            },
            removeItemLocally: async (itemId: string) => {
                const itemToRemove = get().items.find((i: CartItemType) => i._id === itemId);
                set((state: CartState) => ({
                    items: state.items.filter((i: CartItemType) => i._id !== itemId),
                }));

                const user = useAuthStore.getState().user;
                // Delete using the proper backend CartItem DB ID if hydrated, otherwise the backend fails to remove
                if (user) {
                    try {
                        const targetId = itemToRemove?.cartItemId || itemId;
                        await api.delete(`/cart/${targetId}`);
                        await get().fetchCart();
                    } catch (e) {
                        console.error('Failed to sync cart remove', e);
                    }
                }
            },
            updateQuantityLocally: async (itemId: string, quantity: number) => {
                const itemToUpdate = get().items.find((i: CartItemType) => i._id === itemId);
                set((state: CartState) => ({
                    items: state.items.map((i: CartItemType) =>
                        i._id === itemId ? { ...i, quantity } : i
                    ),
                }));

                const user = useAuthStore.getState().user;
                if (user) {
                    try {
                        const targetId = itemToUpdate?.cartItemId || itemId;
                        await api.put(`/cart/${targetId}`, { quantity });
                        // Optional: background sync after a short delay to ensure DB consistency
                    } catch (e) {
                        console.error('Failed to sync cart qty', e);
                    }
                }
            },
            clearCart: () => set({ items: [], cart_id: null }),
            hydrated: false,
            setHydrated: (hydrated) => set({ hydrated }),
            fetchCart: async () => {
                const user = useAuthStore.getState().user;
                if (!user) return;
                try {
                    const { data } = await api.get('/cart');
                    if (data && data.items) {
                        const formattedItems = data.items.map((i: any) => {
                            const p = i.product_variant_id; // This is populated with Product model
                            return {
                                _id: p?._id || i._id,
                                product_variant_id: p?._id,
                                quantity: i.quantity,
                                name: p?.name || p?.title || 'Unknown Product',
                                price: p?.discountPrice || p?.price || 0,
                                originalPrice: p?.price || 0,
                                image: p?.images?.[0]?.url || p?.img || p?.image || '',
                                size: i.size || 'M',
                                cartItemId: i._id // original cartItem DB id
                            };
                        });
                        
                        set({ cart_id: data.cart._id, items: formattedItems });
                    }
                } catch (e) {
                    console.error('Failed to fetch cart', e);
                }
            },
        }),
        {
            name: 'cart-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            }
        }
    )
);
