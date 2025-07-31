// store/cart-store.ts

/*Zustand is a small, fast, and scalable state management library for React.
It’s used to manage global or shared state across components

Let’s say your user adds a product to cart on the Home page and checks out on a Checkout page — Zustand lets both pages access the same cart state.
Now anywhere in your app, you can:
	•	call addToCart() to add items,
	•	read items to show the cart,
	•	update or remove items easily — all in sync across components.

*/




import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types';
import { toast } from 'sonner';

// Define the shape of the cart state
type CartState = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

// Create the Zustand cart store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart (or increase quantity if it exists)
      addToCart: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
          toast.success(`Increased ${item.name} quantity`);
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }));
          toast.success(`${item.name} added to cart`);
        }
      },

      // Remove item from cart
      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
        toast.success("Item removed from cart");
      },

      // Update the quantity of an item
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(itemId);
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i
            ),
          }));
          toast.success("Cart updated");
        }
      },

      // Clear all items from the cart
      clearCart: () => {
        set({ items: [] });
        toast.success("Cart cleared");
      },
    }),

    // Persist the cart state in localStorage
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);