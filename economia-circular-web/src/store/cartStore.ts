import { create } from 'zustand';

interface CartItem {
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  proveedorId: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (item) => set((state) => {
    const existing = state.items.find(i => i.productoId === item.productoId);
    if (existing) {
      return {
        items: state.items.map(i => i.productoId === item.productoId 
          ? { ...i, cantidad: i.cantidad + item.cantidad } 
          : i)
      };
    }
    return { items: [...state.items, item] };
  }),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0)
}));
