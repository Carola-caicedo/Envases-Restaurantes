import { Request, Response, NextFunction } from 'express';
import * as ordenService from './orden.service';
import * as carritoService from './carrito.service';
import prisma from '../../config/prisma';

// Métodos de Carrito
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productoId, cantidad, precioUnitario, proveedorId } = req.body;
    
    let restaurante = await prisma.restaurante.findFirst({ where: { administradorId: req.user!.userId }});
    if (!restaurante && req.user!.rol === 'ADMIN') restaurante = await prisma.restaurante.findFirst();
    if (!restaurante) return res.status(403).json({ success: false, message: 'Usuario no es administrador de un restaurante' });

    const cart = carritoService.addToCart(restaurante.id, { productoId, cantidad, precioUnitario, proveedorId });
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let restaurante = await prisma.restaurante.findFirst({ where: { administradorId: req.user!.userId }});
    if (!restaurante && req.user!.rol === 'ADMIN') restaurante = await prisma.restaurante.findFirst();
    if (!restaurante) return res.status(403).json({ success: false, message: 'Usuario no es administrador de un restaurante' });
    
    res.json({ success: true, data: carritoService.getCart(restaurante.id) });
  } catch (error) {
    next(error);
  }
};

// Métodos de Órdenes
export const crearOrden = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let restaurante = await prisma.restaurante.findFirst({ where: { administradorId: req.user!.userId }});
    if (!restaurante && req.user!.rol === 'ADMIN') restaurante = await prisma.restaurante.findFirst();
    if (!restaurante) return res.status(403).json({ success: false, message: 'Usuario no es administrador de un restaurante' });

    const orden = await ordenService.crearOrden(restaurante.id, req.body.proveedorId);
    res.status(201).json({ success: true, data: orden });
  } catch (error) {
    next(error);
  }
};

export const listarOrdenesRestaurante = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let restaurante = await prisma.restaurante.findFirst({ where: { administradorId: req.user!.userId }});
    if (!restaurante && req.user!.rol === 'ADMIN') restaurante = await prisma.restaurante.findFirst();
    if (!restaurante) return res.status(403).json({ success: false, message: 'Usuario no es administrador de un restaurante' });

    const ordenes = await ordenService.getOrdenesPorRestaurante(restaurante.id);
    res.json({ success: true, data: ordenes });
  } catch (error) {
    next(error);
  }
};

export const listarOrdenesProveedor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const perfil = await prisma.proveedorPerfil.findUnique({ where: { usuarioId: req.user!.userId }});
    if (!perfil) return res.status(403).json({ success: false, message: 'Perfil de proveedor no encontrado' });

    const ordenes = await ordenService.getOrdenesPorProveedor(perfil.id);
    res.json({ success: true, data: ordenes });
  } catch (error) {
    next(error);
  }
};

export const despacharOrden = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const perfil = await prisma.proveedorPerfil.findUnique({ where: { usuarioId: req.user!.userId }});
    if (!perfil) return res.status(403).json({ success: false, message: 'Perfil de proveedor no encontrado' });

    const resultado = await ordenService.aceptarYDespacharOrden(req.params.id, perfil.id);
    res.json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
};

export const recibirOrden = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let restaurante = await prisma.restaurante.findFirst({ where: { administradorId: req.user!.userId }});
    if (!restaurante && req.user!.rol === 'ADMIN') restaurante = await prisma.restaurante.findFirst();
    if (!restaurante) return res.status(403).json({ success: false, message: 'Usuario no es administrador de un restaurante' });

    const resultado = await ordenService.confirmarRecepcion(req.params.id, restaurante.id);
    res.json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
};
