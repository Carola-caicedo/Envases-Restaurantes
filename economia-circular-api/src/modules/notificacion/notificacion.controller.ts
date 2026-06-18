import { Request, Response, NextFunction } from 'express';
import * as notificacionService from './notificacion.service';

export const listarNotificaciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notificaciones = await notificacionService.getNotificaciones(req.user!.userId);
    res.json({ success: true, data: notificaciones });
  } catch (error) {
    next(error);
  }
};

export const countNoLeidas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notificaciones = await notificacionService.getNotificacionesNoLeidas(req.user!.userId);
    res.json({ success: true, count: notificaciones.length, data: notificaciones });
  } catch (error) {
    next(error);
  }
};

export const marcarLeida = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificacionService.marcarComoLeida(req.params.id, req.user!.userId);
    res.json({ success: true, message: 'Notificación marcada como leída' });
  } catch (error) {
    next(error);
  }
};

export const marcarTodasLeidas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificacionService.marcarTodasComoLeidas(req.user!.userId);
    res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    next(error);
  }
};
