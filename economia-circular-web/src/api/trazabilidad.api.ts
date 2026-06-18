import api from './axios';

export const escanearQrAPI = async (data: { qrCode: string, tipoMovimiento: string, clienteEmail?: string }) => {
  const res = await api.post('/trazabilidad/escanear', data);
  return res.data.data;
};

export const getHistorialTrazabilidad = async () => {
  const res = await api.get('/trazabilidad/historial');
  return res.data.data;
};
