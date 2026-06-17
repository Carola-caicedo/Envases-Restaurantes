import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { clearCart, getCart } from './carrito.service';
import { v4 as uuidv4 } from 'uuid';
import { generarQrBase64 } from '../../utils/qr.util';

export const crearOrden = async (restauranteId: string, proveedorId: string) => {
  const cart = getCart(restauranteId);
  if (cart.length === 0) {
    throw new AppError(400, 'El carrito está vacío');
  }

  // Filtrar solo los productos que pertenecen al proveedor indicado
  const itemsProveedor = cart.filter(item => item.proveedorId === proveedorId);
  if (itemsProveedor.length === 0) {
    throw new AppError(400, 'No hay productos de este proveedor en el carrito');
  }

  let total = 0;
  for (const item of itemsProveedor) {
    total += item.precioUnitario * item.cantidad;
  }

  const orden = await prisma.$transaction(async (tx) => {
    const nuevaOrden = await tx.ordenCompra.create({
      data: {
        restauranteId,
        proveedorId,
        total,
        estado: 'PENDIENTE',
        Detalles: {
          create: itemsProveedor.map(item => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          }))
        }
      },
      include: { Detalles: true }
    });

    return nuevaOrden;
  });

  // Limpiamos todo el carrito en esta versión simplificada
  clearCart(restauranteId);

  return orden;
};

export const aceptarYDespacharOrden = async (ordenId: string, proveedorId: string) => {
  const orden = await prisma.ordenCompra.findUnique({
    where: { id: ordenId },
    include: { Detalles: true }
  });

  if (!orden || orden.proveedorId !== proveedorId) {
    throw new AppError(403, 'Orden no encontrada o no autorizada');
  }

  if (orden.estado !== 'PENDIENTE') {
    throw new AppError(400, 'La orden no está en estado PENDIENTE');
  }

  // Despachar la orden genera los Envases físicos y sus QRs
  const envasesGenerados = [];

  await prisma.$transaction(async (tx) => {
    // Cambiar estado
    await tx.ordenCompra.update({
      where: { id: ordenId },
      data: { estado: 'EN_TRANSITO' }
    });

    // Generar envases físicos para cada detalle
    for (const detalle of orden.Detalles) {
      for (let i = 0; i < detalle.cantidad; i++) {
        const uniqueId = uuidv4();
        // QR text puede ser una URL a la PWA o el mismo UUID
        const qrContent = `https://app.economiacircular.com/qr/${uniqueId}`;
        
        await tx.envase.create({
          data: {
            qrCode: uniqueId, // Aquí usamos el ID único real como llave
            productoId: detalle.productoId,
            restauranteId: orden.restauranteId,
            estado: 'EN_USO',
          }
        });

        // Generamos el QR base64 en memoria (podría subirse a S3)
        const qrImageBase64 = await generarQrBase64(qrContent);
        envasesGenerados.push({
          qrCode: uniqueId,
          qrImageBase64,
          productoId: detalle.productoId
        });
      }
    }
  });

  return { ordenId, envases: envasesGenerados };
};

export const getOrdenesPorRestaurante = async (restauranteId: string) => {
  return await prisma.ordenCompra.findMany({
    where: { restauranteId },
    include: { Proveedor: { include: { Usuario: { select: { nombre: true } } } }, Detalles: { include: { Producto: true } } },
    orderBy: { createdAt: 'desc' }
  });
};

export const getOrdenesPorProveedor = async (proveedorId: string) => {
  return await prisma.ordenCompra.findMany({
    where: { proveedorId },
    include: { Restaurante: true, Detalles: { include: { Producto: true } } },
    orderBy: { createdAt: 'desc' }
  });
};
