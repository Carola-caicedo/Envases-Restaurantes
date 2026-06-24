import { Request, Response, NextFunction } from 'express';
import * as proveedorService from './proveedor.service';
import * as productoService from './producto.service';
import prisma from '../../config/prisma';

export const listarProveedores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proveedores = await proveedorService.getProveedores();
    res.json({ success: true, data: proveedores });
  } catch (error) {
    next(error);
  }
};

export const obtenerDetalle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proveedor = await proveedorService.getProveedorDetalle(req.params.id);
    res.json({ success: true, data: proveedor });
  } catch (error) {
    next(error);
  }
};

export const getMiCatalogo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const perfil = await prisma.proveedorPerfil.findUnique({
      where: { usuarioId: req.user!.userId },
      include: {
        Productos: {
          where: { activo: true }
        }
      }
    });

    if (!perfil) {
      return res.status(403).json({ success: false, message: 'Perfil de proveedor no encontrado' });
    }

    res.json({ success: true, data: perfil.Productos });
  } catch (error) {
    next(error);
  }
};

export const crearProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user.userId debería corresponder al usuario logueado (proveedor)
    // Buscamos su perfil de proveedor
    const perfil = await prisma.proveedorPerfil.findUnique({ where: { usuarioId: req.user!.userId } });
    
    if (!perfil) {
      return res.status(403).json({ success: false, message: 'Perfil de proveedor no encontrado' });
    }

    const producto = await productoService.crearProducto(perfil.id, req.body, req.file);
    res.status(201).json({ success: true, data: producto });
  } catch (error) {
    next(error);
  }
};

export const crearPerfil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Admin o Proveedor crean el perfil inicial
    const { usuarioId, nit, direccion, descripcion } = req.body;
    const perfil = await proveedorService.crearPerfil(usuarioId, { nit, direccion, descripcion });
    res.status(201).json({ success: true, data: perfil });
  } catch (error) {
    next(error);
  }
};
