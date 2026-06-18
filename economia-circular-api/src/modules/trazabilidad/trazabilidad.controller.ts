import { Request, Response, NextFunction } from 'express';
import * as trazabilidadService from './trazabilidad.service';
import prisma from '../../config/prisma';

export const escanearQr = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { qrCode, tipoMovimiento, clienteEmail } = req.body;
    
    // Obtenemos el restaurante del cajero/admin que escanea
    const restaurante = await prisma.restaurante.findFirst({
      where: { administradorId: req.user!.userId }
    });

    if (!restaurante) {
      return res.status(403).json({ success: false, message: 'Usuario no asociado a un restaurante' });
    }

    const resultado = await trazabilidadService.registrarMovimiento(
      qrCode,
      restaurante.id,
      tipoMovimiento,
      clienteEmail
    );

    res.status(201).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
};

export const historial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurante = await prisma.restaurante.findFirst({
      where: { administradorId: req.user!.userId }
    });

    if (!restaurante) {
      return res.status(403).json({ success: false, message: 'Usuario no asociado a un restaurante' });
    }

    const historial = await trazabilidadService.getHistorialRestaurante(restaurante.id);
    res.json({ success: true, data: historial });
  } catch (error) {
    next(error);
  }
};
