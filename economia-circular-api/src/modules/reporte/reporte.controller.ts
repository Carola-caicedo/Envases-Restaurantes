import { Request, Response, NextFunction } from 'express';
import * as reporteService from './reporte.service';
import prisma from '../../config/prisma';

export const getRestauranteDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurante = await prisma.restaurante.findFirst({
      where: { administradorId: req.user!.userId }
    });

    if (!restaurante) {
      return res.status(403).json({ success: false, message: 'Usuario no asociado a un restaurante' });
    }

    const stats = await reporteService.getDashboardStats(restaurante.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
