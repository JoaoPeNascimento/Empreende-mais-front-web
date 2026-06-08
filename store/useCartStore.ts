import { create } from "zustand";

interface CartItem {
  cartItemId: string;
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  color?: string;
  size?: string;
}

type CartProductInput = Omit<CartItem, "cartItemId">;

interface CartState {
  cart: CartItem[];
  addToCart: (product: CartProductInput) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  addToCart: (product) =>
    set((state) => ({
      cart: [
        ...state.cart,
        {
          ...product,
          cartItemId: `${product.id}-${Date.now()}-${state.cart.length}`,
        },
      ],
    })),

  removeFromCart: (cartItemId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
    })),

  clearCart: () => set({ cart: [] }),
}));
