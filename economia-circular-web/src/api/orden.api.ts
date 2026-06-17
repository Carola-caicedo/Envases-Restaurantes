import api from './axios';

export const addToCartAPI = async (data: { productoId: string, cantidad: number, precioUnitario: number, proveedorId: string }) => {
  const res = await api.post('/ordenes/carrito', data);
  return res.data;
};

export const getCartAPI = async () => {
  const res = await api.get('/ordenes/carrito');
  return res.data.data;
};

export const crearOrdenAPI = async (proveedorId: string) => {
  const res = await api.post('/ordenes', { proveedorId });
  return res.data.data;
};

export const getOrdenesRestaurante = async () => {
  const res = await api.get('/ordenes/restaurante');
  return res.data.data;
};

export const getOrdenesProveedor = async () => {
  const res = await api.get('/ordenes/proveedor');
  return res.data.data;
};

export const despacharOrdenAPI = async (ordenId: string) => {
  const res = await api.put(`/ordenes/${ordenId}/despachar`);
  return res.data.data;
};
