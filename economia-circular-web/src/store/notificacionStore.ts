import { create } from 'zustand';
import { getNotificacionesAPI, marcarLeidaAPI, marcarTodasLeidasAPI } from '../api/notificacion.api';

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}

interface NotificacionState {
  notificaciones: Notificacion[];
  noLeidasCount: number;
  fetchNotificaciones: () => Promise<void>;
  marcarLeida: (id: string) => Promise<void>;
  marcarTodas: () => Promise<void>;
}

export const useNotificacionStore = create<NotificacionState>((set, get) => ({
  notificaciones: [],
  noLeidasCount: 0,
  
  fetchNotificaciones: async () => {
    try {
      const data = await getNotificacionesAPI();
      const noLeidas = data.filter((n: Notificacion) => !n.leida).length;
      set({ notificaciones: data, noLeidasCount: noLeidas });
    } catch (e) {
      console.error('Error fetching notificaciones', e);
    }
  },

  marcarLeida: async (id: string) => {
    try {
      await marcarLeidaAPI(id);
      await get().fetchNotificaciones();
    } catch (e) {
      console.error(e);
    }
  },

  marcarTodas: async () => {
    try {
      await marcarTodasLeidasAPI();
      await get().fetchNotificaciones();
    } catch (e) {
      console.error(e);
    }
  }
}));
