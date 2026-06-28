import type { Envase, Cliente, EstadoEnvase, MotivoBaja, TransaccionEnvase, BajaEnvase } from '../types';

// ─── Configuración de estados de envase ───────────────────────────────────────
export const ESTADOS_ENVASE_CONFIG: Record<
  EstadoEnvase,
  { label: string; bg: string; color: string }
> = {
  DISPONIBLE: { label: 'Disponible', bg: '#2d7a5022', color: '#38a169' },
  EN_USO: { label: 'En Uso (Prestado)', bg: '#3182ce22', color: '#63b3ed' },
  EN_LAVADO: { label: 'En Lavado', bg: '#d6a04a22', color: '#ecc94b' },
  FUERA_CIRCULACION: { label: 'Fuera de Circulación', bg: '#e53e3e22', color: '#fc8181' },
  PERDIDO: { label: 'Perdido', bg: '#dd6b2022', color: '#f6ad55' },
};

// ─── Clientes iniciales ────────────────────────────────────────────────────────
const INITIAL_CLIENTES: Cliente[] = [
  {
    id: 'cli_001',
    usuarioId: '10',
    nombre: 'Carlos Gómez',
    email: 'carlos@demo.com',
    telefono: '3001234567',
    ecoPuntos: 120,
    depositoAcumulado: 15000,
  },
  {
    id: 'cli_002',
    usuarioId: '11',
    nombre: 'Sofía Rodríguez',
    email: 'sofia@demo.com',
    telefono: '3157654321',
    ecoPuntos: 350,
    depositoAcumulado: 45000,
  },
  {
    id: 'cli_003',
    usuarioId: '12',
    nombre: 'Mateo Henao',
    email: 'mateo@demo.com',
    telefono: '3209876543',
    ecoPuntos: 40,
    depositoAcumulado: 0,
  },
];

// ─── Envases iniciales ────────────────────────────────────────────────────────
const INITIAL_ENVASES: Envase[] = [
  {
    id: 'env_001',
    codigoQr: 'QR-EC-TAR-001',
    idAlfanumerico: 'EC-TAR-001',
    productoCatalogoId: 'prod-001',
    ordenOrigenId: 'ORD-100293',
    restauranteId: 'rest_001',
    estado: 'DISPONIBLE',
    cantidadUsos: 15,
    maxUsos: 200,
    fechaRegistro: '2026-05-10T14:30:00Z',
    ultimoCambioEstado: '2026-06-25T18:00:00Z',
    nombreProducto: 'Tarro Vidrio 350ml',
    material: 'VIDRIO',
    capacidadMl: 350,
  },
  {
    id: 'env_002',
    codigoQr: 'QR-EC-TAR-002',
    idAlfanumerico: 'EC-TAR-002',
    productoCatalogoId: 'prod-001',
    ordenOrigenId: 'ORD-100293',
    restauranteId: 'rest_001',
    estado: 'EN_USO',
    cantidadUsos: 48,
    maxUsos: 200,
    fechaRegistro: '2026-05-10T14:30:00Z',
    ultimoCambioEstado: '2026-06-26T12:45:00Z',
    nombreProducto: 'Tarro Vidrio 350ml',
    material: 'VIDRIO',
    capacidadMl: 350,
  },
  {
    id: 'env_003',
    codigoQr: 'QR-EC-BOW-001',
    idAlfanumerico: 'EC-BOW-001',
    productoCatalogoId: 'prod-002',
    ordenOrigenId: 'ORD-100294',
    restauranteId: 'rest_001',
    estado: 'EN_LAVADO',
    cantidadUsos: 124,
    maxUsos: 500,
    fechaRegistro: '2026-05-15T09:15:00Z',
    ultimoCambioEstado: '2026-06-27T08:00:00Z',
    nombreProducto: 'Bowl Acero 500ml',
    material: 'ACERO_INOXIDABLE',
    capacidadMl: 500,
  },
  {
    id: 'env_004',
    codigoQr: 'QR-EC-PLT-001',
    idAlfanumerico: 'EC-PLT-001',
    productoCatalogoId: 'prod-003',
    ordenOrigenId: 'ORD-100295',
    restauranteId: 'rest_001',
    estado: 'PERDIDO',
    cantidadUsos: 8,
    maxUsos: 100,
    fechaRegistro: '2026-06-01T16:00:00Z',
    ultimoCambioEstado: '2026-06-20T22:30:00Z',
    nombreProducto: 'Envase Plástico 1L',
    material: 'PLASTICO_REUTILIZABLE',
    capacidadMl: 1000,
  },
  {
    id: 'env_005',
    codigoQr: 'QR-EC-TAR-003',
    idAlfanumerico: 'EC-TAR-003',
    productoCatalogoId: 'prod-001',
    ordenOrigenId: 'ORD-100293',
    restauranteId: 'rest_001',
    estado: 'DISPONIBLE',
    cantidadUsos: 199,
    maxUsos: 200,
    fechaRegistro: '2026-05-10T14:30:00Z',
    ultimoCambioEstado: '2026-06-27T10:00:00Z',
    nombreProducto: 'Tarro Vidrio 350ml (Al límite)',
    material: 'VIDRIO',
    capacidadMl: 350,
  },
  {
    id: 'env_006',
    codigoQr: 'QR-EC-TAR-004',
    idAlfanumerico: 'EC-TAR-004',
    productoCatalogoId: 'prod-001',
    ordenOrigenId: 'ORD-100293',
    restauranteId: 'rest_001',
    estado: 'EN_USO',
    cantidadUsos: 199,
    maxUsos: 200,
    fechaRegistro: '2026-05-10T14:30:00Z',
    ultimoCambioEstado: '2026-06-26T15:00:00Z',
    nombreProducto: 'Tarro Vidrio 350ml (Al límite prestado)',
    material: 'VIDRIO',
    capacidadMl: 350,
  },
];

// Costo fijo del depósito de garantía
export const COSTO_DEPOSITO = 5000;
export const ECO_PUNTOS_POR_DEVOLUCION = 10;

// ─── Funciones de Persistencia local ──────────────────────────────────────────
const KEY_ENVASES = 'ec-demo-envases';
const KEY_CLIENTES = 'ec-demo-clientes';
const KEY_TRANSACCIONES = 'ec-demo-transacciones';
const KEY_BAJAS = 'ec-demo-bajas';

export const getEnvases = (): Envase[] => {
  const local = localStorage.getItem(KEY_ENVASES);
  if (!local) {
    localStorage.setItem(KEY_ENVASES, JSON.stringify(INITIAL_ENVASES));
    return INITIAL_ENVASES;
  }
  return JSON.parse(local);
};

export const getClientes = (): Cliente[] => {
  const local = localStorage.getItem(KEY_CLIENTES);
  if (!local) {
    localStorage.setItem(KEY_CLIENTES, JSON.stringify(INITIAL_CLIENTES));
    return INITIAL_CLIENTES;
  }
  return JSON.parse(local);
};

export const getTransacciones = (): TransaccionEnvase[] => {
  const local = localStorage.getItem(KEY_TRANSACCIONES);
  return local ? JSON.parse(local) : [];
};

export const getBajas = (): BajaEnvase[] => {
  const local = localStorage.getItem(KEY_BAJAS);
  return local ? JSON.parse(local) : [];
};

// Buscar envase por código QR o ID alfanumérico
export const buscarEnvase = (scanValue: string): Envase | null => {
  const envases = getEnvases();
  const search = scanValue.trim().toUpperCase();
  return (
    envases.find(
      (e) =>
        e.codigoQr.toUpperCase() === search ||
        e.idAlfanumerico.toUpperCase() === search ||
        e.id.toUpperCase() === search,
    ) ?? null
  );
};

// Registrar Préstamo (Salida)
export const registrarPrestamo = (
  envaseId: string,
  clienteId: string,
  cajeroId: string,
): { success: boolean; envase: Envase; cliente: Cliente } => {
  const envases = getEnvases();
  const clientes = getClientes();
  const transacciones = getTransacciones();

  const envaseIndex = envases.findIndex((e) => e.id === envaseId);
  const clienteIndex = clientes.findIndex((c) => c.id === clienteId);

  if (envaseIndex === -1) throw new Error('Envase no encontrado');
  if (clienteIndex === -1) throw new Error('Cliente no encontrado');

  const envase = envases[envaseIndex];
  if (envase.estado !== 'DISPONIBLE') {
    throw new Error(`El envase no está disponible. Estado actual: ${envase.estado}`);
  }

  // Actualizar envase
  envase.estado = 'EN_USO';
  envase.ultimoCambioEstado = new Date().toISOString();
  envases[envaseIndex] = envase;

  // Actualizar cliente (Retener depósito en el acumulado)
  const cliente = clientes[clienteIndex];
  cliente.depositoAcumulado += COSTO_DEPOSITO;
  clientes[clienteIndex] = cliente;

  // Registrar transacción
  const nuevaTransaccion: TransaccionEnvase = {
    id: `tx_${Date.now()}`,
    envaseId,
    clienteId,
    cajeroId,
    tipo: 'SALIDA',
    fechaSalida: new Date().toISOString(),
    depositoRetenido: COSTO_DEPOSITO,
    depositoLiberado: false,
    ecoPuntosAsignados: 0,
    cicloCerrado: false,
  };

  localStorage.setItem(KEY_ENVASES, JSON.stringify(envases));
  localStorage.setItem(KEY_CLIENTES, JSON.stringify(clientes));
  localStorage.setItem(KEY_TRANSACCIONES, JSON.stringify([...transacciones, nuevaTransaccion]));

  return { success: true, envase, cliente };
};

// Registrar Devolución
export const registrarDevolucion = (
  envaseId: string,
  operarioId: string,
): { success: boolean; envase: Envase; cliente: Cliente | null; ecoPuntosAsignados: number; bajaAutomatica: boolean } => {
  const envases = getEnvases();
  const clientes = getClientes();
  const transacciones = getTransacciones();

  const envaseIndex = envases.findIndex((e) => e.id === envaseId);
  if (envaseIndex === -1) throw new Error('Envase no encontrado');

  const envase = envases[envaseIndex];

  // Buscar última transacción activa para este envase para identificar al cliente
  const txIndex = transacciones.findIndex((t) => t.envaseId === envaseId && !t.cicloCerrado);
  let cliente: Cliente | null = null;
  let ecoPuntosAsignados = ECO_PUNTOS_POR_DEVOLUCION;

  if (txIndex !== -1) {
    const tx = transacciones[txIndex];
    tx.cicloCerrado = true;
    tx.fechaDevolucion = new Date().toISOString();
    tx.depositoLiberado = true;
    tx.operarioDevolucionId = operarioId;
    tx.ecoPuntosAsignados = ECO_PUNTOS_POR_DEVOLUCION;
    transacciones[txIndex] = tx;

    // Actualizar cliente: devolver depósito y sumar ecoPuntos
    const cliIndex = clientes.findIndex((c) => c.id === tx.clienteId);
    if (cliIndex !== -1) {
      cliente = clientes[cliIndex];
      cliente.depositoAcumulado = Math.max(0, cliente.depositoAcumulado - COSTO_DEPOSITO);
      cliente.ecoPuntos += ECO_PUNTOS_POR_DEVOLUCION;
      clientes[cliIndex] = cliente;
    }
  }

  // Sumar un uso
  envase.cantidadUsos += 1;
  let bajaAutomatica = false;

  // Lógica de baja automática por fin de ciclo de vida
  if (envase.cantidadUsos >= envase.maxUsos) {
    envase.estado = 'FUERA_CIRCULACION';
    bajaAutomatica = true;

    // Registrar baja de envase
    const bajas = getBajas();
    const nuevaBaja: BajaEnvase = {
      id: `baja_${Date.now()}`,
      envaseId,
      operarioId,
      motivo: 'CICLO_COMPLETADO',
      observaciones: 'Baja automática generada por alcanzar el límite máximo de usos operativos.',
      fechaBaja: new Date().toISOString(),
    };
    localStorage.setItem(KEY_BAJAS, JSON.stringify([...bajas, nuevaBaja]));
  } else {
    envase.estado = 'EN_LAVADO';
  }

  envase.ultimoCambioEstado = new Date().toISOString();
  envases[envaseIndex] = envase;

  localStorage.setItem(KEY_ENVASES, JSON.stringify(envases));
  localStorage.setItem(KEY_CLIENTES, JSON.stringify(clientes));
  localStorage.setItem(KEY_TRANSACCIONES, JSON.stringify(transacciones));

  return { success: true, envase, cliente, ecoPuntosAsignados, bajaAutomatica };
};

// Registrar Baja Manual
export const registrarBaja = (
  envaseId: string,
  motivo: MotivoBaja,
  observaciones: string,
  operarioId: string,
): { success: boolean; envase: Envase } => {
  const envases = getEnvases();
  const bajas = getBajas();

  const envaseIndex = envases.findIndex((e) => e.id === envaseId);
  if (envaseIndex === -1) throw new Error('Envase no encontrado');

  const envase = envases[envaseIndex];
  if (envase.estado === 'FUERA_CIRCULACION') {
    throw new Error('El envase ya está fuera de circulación.');
  }

  envase.estado = 'FUERA_CIRCULACION';
  envase.ultimoCambioEstado = new Date().toISOString();
  envases[envaseIndex] = envase;

  const nuevaBaja: BajaEnvase = {
    id: `baja_${Date.now()}`,
    envaseId,
    operarioId,
    motivo,
    observaciones,
    fechaBaja: new Date().toISOString(),
  };

  localStorage.setItem(KEY_ENVASES, JSON.stringify(envases));
  localStorage.setItem(KEY_BAJAS, JSON.stringify([...bajas, nuevaBaja]));

  return { success: true, envase };
};
