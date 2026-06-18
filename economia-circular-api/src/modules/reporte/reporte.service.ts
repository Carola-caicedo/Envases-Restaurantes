import prisma from '../../config/prisma';

export const getDashboardStats = async (restauranteId: string) => {
  // 1. Envases activos (prestados a clientes)
  const envasesEnUso = await prisma.envase.count({
    where: {
      restauranteId,
      estado: 'EN_USO'
    }
  });

  // 2. Envases en inventario (Listos, Limpios)
  const envasesEnInventario = await prisma.envase.count({
    where: {
      restauranteId,
      estado: 'INACTIVO'
    }
  });

  // 3. Retornos Totales
  const retornosTotales = await prisma.transaccionEnvase.count({
    where: {
      restauranteId,
      tipoMovimiento: 'RETORNO'
    }
  });

  // 4. Clientes Participantes Únicos
  const clientesActivosResult = await prisma.transaccionEnvase.findMany({
    where: {
      restauranteId,
      clienteId: { not: null }
    },
    select: { clienteId: true },
    distinct: ['clienteId']
  });
  const clientesActivos = clientesActivosResult.length;

  // 5. Impacto Ecológico (Aproximación: 1 retorno = 1 envase desechable evitado = 0.05kg CO2 ahorrado)
  const envasesEvitados = retornosTotales;
  const kgCo2Ahorrado = parseFloat((envasesEvitados * 0.05).toFixed(2));

  // 6. Retornos por día (Para el gráfico)
  // SQLite no tiene buenas funciones de agrupación por fecha, así que lo hacemos en memoria para este prototipo
  const transaccionesRecientes = await prisma.transaccionEnvase.findMany({
    where: { restauranteId, tipoMovimiento: 'RETORNO' },
    orderBy: { fecha: 'asc' }
  });

  const retornosPorDia = transaccionesRecientes.reduce((acc: any, transaccion) => {
    const dateStr = transaccion.fecha.toISOString().split('T')[0];
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(retornosPorDia).map((date) => ({
    date,
    retornos: retornosPorDia[date]
  })).slice(-30); // Últimos 30 días

  return {
    kpis: {
      envasesEnUso,
      envasesEnInventario,
      retornosTotales,
      clientesActivos,
      impacto: {
        envasesEvitados,
        kgCo2Ahorrado
      }
    },
    chartData
  };
};
