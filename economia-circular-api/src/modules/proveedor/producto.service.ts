import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/error.middleware';

export const crearProducto = async (
  proveedorId: string,
  data: any,
  file?: Express.Multer.File
) => {
  let imagenUrl = null;

  if (file) {
    // La imagen se guarda localmente usando multer, construimos la url
    imagenUrl = `/uploads/${file.filename}`;
  }

  const producto = await prisma.productoCatalogo.create({
    data: {
      proveedorId,
      nombre: data.nombre,
      descripcion: data.descripcion,
      material: data.material,
      capacidadMl: data.capacidadMl ? parseInt(data.capacidadMl) : null,
      dimensiones: data.dimensiones,
      precioUnitario: parseFloat(data.precioUnitario),
      maxUsosEstimado: parseInt(data.maxUsosEstimado),
      imagenUrl,
      activo: true,
    },
  });

  return producto;
};

export const desactivarProducto = async (productoId: string, proveedorId: string) => {
  const producto = await prisma.productoCatalogo.findUnique({ where: { id: productoId } });
  if (!producto || producto.proveedorId !== proveedorId) {
    throw new AppError(403, 'No autorizado para modificar este producto');
  }

  return await prisma.productoCatalogo.update({
    where: { id: productoId },
    data: { activo: false }
  });
};
