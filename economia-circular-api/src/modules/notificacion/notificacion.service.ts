import prisma from '../../config/prisma';

export const crearNotificacion = async (usuarioId: string, titulo: string, mensaje: string, tipo: string = 'INFO') => {
  return await prisma.notificacion.create({
    data: {
      usuarioId,
      titulo,
      mensaje,
      tipo
    }
  });
};

export const getNotificaciones = async (usuarioId: string) => {
  return await prisma.notificacion.findMany({
    where: { usuarioId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
};

export const getNotificacionesNoLeidas = async (usuarioId: string) => {
  return await prisma.notificacion.findMany({
    where: { usuarioId, leida: false },
    orderBy: { createdAt: 'desc' }
  });
};

export const marcarComoLeida = async (id: string, usuarioId: string) => {
  // Asegurarse de que la notificación pertenece al usuario
  const notificacion = await prisma.notificacion.findUnique({ where: { id } });
  if (notificacion && notificacion.usuarioId === usuarioId) {
    return await prisma.notificacion.update({
      where: { id },
      data: { leida: true }
    });
  }
  return null;
};

export const marcarTodasComoLeidas = async (usuarioId: string) => {
  return await prisma.notificacion.updateMany({
    where: { usuarioId, leida: false },
    data: { leida: true }
  });
};
