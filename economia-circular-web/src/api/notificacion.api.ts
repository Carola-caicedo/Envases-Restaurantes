import api from './axios';

export const getNotificacionesAPI = async () => {
  const res = await api.get('/notificaciones');
  return res.data.data;
};

export const getNoLeidasCountAPI = async () => {
  const res = await api.get('/notificaciones/count');
  return res.data.count;
};

export const marcarLeidaAPI = async (id: string) => {
  await api.put(`/notificaciones/${id}/leida`);
};

export const marcarTodasLeidasAPI = async () => {
  await api.put('/notificaciones/leidas/todas');
};
