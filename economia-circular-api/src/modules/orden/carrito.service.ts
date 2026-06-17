// Implementación en memoria simple para el carrito
// En producción, esto sería un cliente de Redis
const carts = new Map<string, any[]>();

export const getCart = (userId: string) => {
  return carts.get(userId) || [];
};

export const addToCart = (userId: string, item: any) => {
  const currentCart = getCart(userId);
  const existingItem = currentCart.find((i) => i.productoId === item.productoId);
  
  if (existingItem) {
    existingItem.cantidad += item.cantidad;
  } else {
    currentCart.push(item);
  }
  
  carts.set(userId, currentCart);
  return currentCart;
};

export const clearCart = (userId: string) => {
  carts.delete(userId);
};
