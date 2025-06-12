import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  sessionId: string;
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      sessionId: Math.random().toString(36).substr(2, 9),
      cartCount: 0,
      setCartCount: (count) => set({ cartCount: count }),
      incrementCartCount: () => set((state) => ({ cartCount: state.cartCount + 1 })),
      decrementCartCount: () => set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),
    }),
    {
      name: 'cart-storage',
    }
  )
);
