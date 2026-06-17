import api from './axios';

export const getProveedores = async () => {
  const { data } = await api.get('/proveedores');
  return data.data;
};

export const getProveedorDetalle = async (id: string) => {
  const { data } = await api.get(`/proveedores/${id}`);
  return data.data;
};

export const crearProducto = async (formData: FormData) => {
  const { data } = await api.post('/proveedores/productos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data.data;
};

export const crearPerfilProveedor = async (perfilData: any) => {
  const { data } = await api.post('/proveedores/perfil', perfilData);
  return data.data;
};
