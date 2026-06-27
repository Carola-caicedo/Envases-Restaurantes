import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, ProductoCatalogo } from '../types';

interface CartState {
  items: CartItem[];
  proveedorId: string | null;
  proveedorNombre: string | null;

  // Actions
  addItem: (producto: ProductoCatalogo, proveedorId: string, proveedorNombre: string) => void;
  removeItem: (productoId: string) => void;
  updateCantidad: (productoId: string, cantidad: number) => void;
  clearCart: () => void;

  // Computed (selectors)
  totalItems: () => number;
  totalPrecio: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      proveedorId: null,
      proveedorNombre: null,

      addItem: (producto, proveedorId, proveedorNombre) => {
        const { items, proveedorId: currentProveedor } = get();

        // Si el carrito ya tiene productos de otro proveedor, limpiar primero
        if (currentProveedor && currentProveedor !== proveedorId) {
          set({ items: [], proveedorId: null, proveedorNombre: null });
        }

        const existing = get().items.find((i) => i.producto.id === producto.id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.producto.id === producto.id
                ? { ...i, cantidad: i.cantidad + 1 }
                : i,
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { producto, cantidad: 1 }],
            proveedorId,
            proveedorNombre,
          }));
        }
      },

      removeItem: (productoId) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.producto.id !== productoId);
          return {
            items: newItems,
            proveedorId: newItems.length === 0 ? null : state.proveedorId,
            proveedorNombre: newItems.length === 0 ? null : state.proveedorNombre,
          };
        }),

      updateCantidad: (productoId, cantidad) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.producto.id === productoId ? { ...i, cantidad: Math.max(1, cantidad) } : i,
          ),
        })),

      clearCart: () => set({ items: [], proveedorId: null, proveedorNombre: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.cantidad, 0),
      totalPrecio: () =>
        get().items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0),
    }),
    {
      name: 'ec-cart-storage',
    },
  ),
);
