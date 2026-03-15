import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
    _id: string;
    name: string;
    email: string;
    token: string;
    role: 'customer' | 'staff' | 'admin';
    rewardPoints?: number;
} | null;

interface AppState {
    user: User;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cart: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wishlist: any[];
    flashSaleActive: boolean;
    lastLoginDate: string | null;
    setUser: (user: User) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addToCart: (item: any) => void;
    updateQuantity: (id: string, qty: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addToWishlist: (item: any) => void;
    removeFromWishlist: (id: string) => void;
    claimDailyReward: () => number; // Returns points earned
    triggerFlashSale: (status: boolean) => void;
    logout: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            user: null,
            cart: [],
            wishlist: [],
            lastLoginDate: null,
            flashSaleActive: false,
            setUser: (user) => set({ user }),
            addToCart: (item) =>
                set((state) => {
                    const existingItem = state.cart.find((i) => i._id === item._id);
                    if (existingItem) {
                        return {
                            cart: state.cart.map((i) =>
                                i._id === item._id ? { ...i, qty: i.qty + 1 } : i
                            ),
                        };
                    }
                    return { cart: [...state.cart, { ...item, qty: 1 }] };
                }),
            updateQuantity: (id, qty) =>
                set((state) => ({
                    cart: state.cart.map((i) =>
                        i._id === id ? { ...i, qty: Math.max(1, qty) } : i
                    ),
                })),
            removeFromCart: (id) =>
                set((state) => ({ cart: state.cart.filter((i) => i._id !== id) })),
            clearCart: () => set({ cart: [] }),
            addToWishlist: (item) =>
                set((state) => {
                    if (!state.wishlist.find((i) => i._id === item._id)) {
                        return { wishlist: [...state.wishlist, item] };
                    }
                    return state;
                }),
            removeFromWishlist: (id) =>
                set((state) => ({ wishlist: state.wishlist.filter((i) => i._id !== id) })),
            claimDailyReward: () => {
                let earned = 0;
                set((state) => {
                    const today = new Date().toDateString();
                    if (state.lastLoginDate !== today) {
                        earned = 50; // Earn 50 points per day
                        const currentPoints = state.user?.rewardPoints || 0;
                        return {
                            lastLoginDate: today,
                            user: state.user ? { ...state.user, rewardPoints: currentPoints + earned } : null
                        };
                    }
                    return state;
                });
                return earned;
            },
            triggerFlashSale: (status) => set({ flashSaleActive: status }),
            logout: () => set({ user: null, cart: [], wishlist: [], lastLoginDate: null }),
        }),
        {
            name: 'ecommerce-storage',
        }
    )
);
