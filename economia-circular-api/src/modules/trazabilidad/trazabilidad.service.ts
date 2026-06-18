import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/error.middleware';

export const registrarMovimiento = async (
  qrCode: string,
  restauranteId: string,
  tipoMovimiento: 'PRESTAMO' | 'RETORNO' | 'LAVADO' | 'DESCARTE',
  clienteEmail?: string
) => {
  // Verificamos que el envase existe y pertenece a este restaurante
  const envase = await prisma.envase.findUnique({
    where: { qrCode },
    include: { Producto: true }
  });

  if (!envase) {
    throw new AppError(404, 'Envase no encontrado');
  }

  if (envase.restauranteId !== restauranteId) {
    throw new AppError(403, 'El envase no pertenece a este restaurante');
  }

  if (envase.estado === 'DESECHADO') {
    throw new AppError(400, 'El envase ya fue descartado y no puede usarse');
  }

  let clienteId = null;
  if (clienteEmail) {
    const cliente = await prisma.cliente.findFirst({
      where: { Usuario: { email: clienteEmail } }
    });
    if (!cliente) {
      throw new AppError(404, 'Cliente no registrado en el sistema');
    }
    clienteId = cliente.id;
  }

  return await prisma.$transaction(async (tx) => {
    // Registramos la trazabilidad
    const transaccion = await tx.transaccionEnvase.create({
      data: {
        envaseQr: qrCode,
        restauranteId,
        clienteId,
        tipoMovimiento,
      }
    });

    let nuevoEstado = envase.estado;
    let nuevosUsos = envase.usosActuales;

    // Actualizar estado del envase según el movimiento
    switch (tipoMovimiento) {
      case 'PRESTAMO':
        nuevoEstado = 'EN_USO'; // En manos del cliente
        break;
      case 'RETORNO':
        nuevoEstado = 'LAVADO'; // Listo para lavar
        nuevosUsos += 1;
        
        // Asignar Ecopuntos al cliente (Regla de negocio: 10 puntos por retorno)
        if (clienteId) {
          await tx.cliente.update({
            where: { id: clienteId },
            data: { ecoPuntos: { increment: 10 } }
          });
        }
        
        // Verificar si superó vida útil
        if (nuevosUsos >= envase.Producto.maxUsosEstimado) {
          nuevoEstado = 'DESECHADO'; // Debe reciclarse
        }
        break;
      case 'LAVADO':
        nuevoEstado = 'INACTIVO'; // Limpio, listo para nuevo uso
        break;
      case 'DESCARTE':
        nuevoEstado = 'DESECHADO';
        break;
    }

    await tx.envase.update({
      where: { qrCode },
      data: {
        estado: nuevoEstado,
        usosActuales: nuevosUsos
      }
    });

    return {
      transaccion,
      envaseEstado: nuevoEstado,
      usosActuales: nuevosUsos,
      maxUsos: envase.Producto.maxUsosEstimado
    };
  });
};

export const getHistorialRestaurante = async (restauranteId: string) => {
  return await prisma.transaccionEnvase.findMany({
    where: { restauranteId },
    include: {
      Envase: { include: { Producto: true } },
      Cliente: { include: { Usuario: { select: { nombre: true, email: true } } } }
    },
    orderBy: { fecha: 'desc' }
  });
};
