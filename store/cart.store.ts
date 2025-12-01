import { productsTable } from '@/server/db/schema';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ProductSelect = typeof productsTable.$inferSelect;
type CartItem = ProductSelect & { quantity: number };

type CartStore = {
  products: CartItem[];
  addToCart: (product: ProductSelect, quantity?: number) => void;
  deleteFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, availableStock?: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      products: [],
      addToCart: (product, quantity = 1) => {
        const current = get().products;
        const existing = current.find((p) => p.id === product.id);
        if (existing) {
          set({
            products: current.map((p) =>
              p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
            ),
          });
        } else {
          set({ products: [...current, { ...product, quantity }] });
        }
      },
      deleteFromCart: (productId) =>
        set({ products: get().products.filter((p) => p.id !== productId) }),
      updateQuantity: (productId, quantity, availableStock) => {
        if (quantity <= 0) {
          // remove if zero or negative
          set({ products: get().products.filter((p) => p.id !== productId) });
        } else {
          set({
            products: get().products.map((p) =>
              p.id === productId
                ? {
                    ...p,
                    quantity,
                    stock: availableStock ?? p.stock,
                  }
                : p
            ),
          });
        }
      },
      clearCart: () => set({ products: [] }),
      getTotalItems: () => get().products.reduce((acc, p) => acc + p.quantity, 0),
      getTotalPrice: () => get().products.reduce((acc, p) => acc + p.price * p.quantity, 0),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
