import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/error.middleware';

export const getProveedores = async () => {
  return await prisma.proveedorPerfil.findMany({
    include: {
      Usuario: {
        select: { nombre: true, email: true, activo: true }
      }
    }
  });
};

export const getProveedorDetalle = async (proveedorId: string) => {
  const proveedor = await prisma.proveedorPerfil.findUnique({
    where: { id: proveedorId },
    include: {
      Usuario: {
        select: { nombre: true, email: true }
      },
      Productos: {
        where: { activo: true },
      },
    },
  });

  if (!proveedor) {
    throw new AppError(404, 'Proveedor no encontrado');
  }

  return proveedor;
};

export const crearPerfil = async (usuarioId: string, data: any) => {
  return await prisma.proveedorPerfil.create({
    data: {
      usuarioId,
      nit: data.nit,
      direccion: data.direccion,
      descripcion: data.descripcion,
    }
  });
};
