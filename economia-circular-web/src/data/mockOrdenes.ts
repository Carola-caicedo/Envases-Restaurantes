import type { OrdenCompra, EstadoOrden } from '../types';

// ─── Config estados (compartida entre vistas) ──────────────────────────────────
export const ESTADO_CONFIG: Record<
  EstadoOrden,
  { label: string; color: string; bg: string }
> = {
  PENDIENTE:      { label: 'Pendiente',      color: '#f6ad55', bg: '#f6ad5522' },
  ACEPTADA:       { label: 'Aceptada',        color: '#68d391', bg: '#68d39122' },
  EN_PREPARACION: { label: 'En preparación',  color: '#63b3ed', bg: '#63b3ed22' },
  EN_TRANSITO:    { label: 'En tránsito',     color: '#9f7aea', bg: '#9f7aea22' },
  COMPLETADA:     { label: 'Completada',       color: '#48bb78', bg: '#48bb7822' },
  CANCELADA:      { label: 'Cancelada',        color: '#fc8181', bg: '#fc818122' },
};

// ─── Órdenes mock (fuente única de verdad para el demo) ────────────────────────
export const MOCK_ORDENES: OrdenCompra[] = [
  {
    id: 'ord_001',
    numeroOrden: 'ORD-240001',
    administradorId: 'admin_1',
    proveedorId: 'prov_001',
    proveedorNombre: 'EcoEnvases Colombia S.A.S',
    estado: 'EN_TRANSITO',
    numeroEnvio: 'TRK-4892761',
    total: 2850000,
    createdAt: '2026-06-20T09:15:00Z',
    updatedAt: '2026-06-22T14:30:00Z',
    detalles: [
      { id: 'd1', ordenId: 'ord_001', productoId: 'p1', productoNombre: 'Tarro Vidrio 500ml',  cantidad: 120, precioUnitario: 12500, subtotal: 1500000 },
      { id: 'd2', ordenId: 'ord_001', productoId: 'p2', productoNombre: 'Bowl Acero 800ml',    cantidad: 60,  precioUnitario: 22500, subtotal: 1350000 },
    ],
  },
  {
    id: 'ord_002',
    numeroOrden: 'ORD-240002',
    administradorId: 'admin_1',
    proveedorId: 'prov_001',
    proveedorNombre: 'EcoEnvases Colombia S.A.S',
    estado: 'PENDIENTE',
    total: 980000,
    fechaLimiteRespuesta: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(), // 14h restantes
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    detalles: [
      { id: 'd3', ordenId: 'ord_002', productoId: 'p3', productoNombre: 'Contenedor Bambú 1L', cantidad: 40, precioUnitario: 24500, subtotal: 980000 },
    ],
  },
  {
    id: 'ord_003',
    numeroOrden: 'ORD-240003',
    administradorId: 'admin_1',
    proveedorId: 'prov_001',
    proveedorNombre: 'EcoEnvases Colombia S.A.S',
    estado: 'COMPLETADA',
    numeroEnvio: 'TRK-3317290',
    total: 4200000,
    createdAt: '2026-06-10T11:00:00Z',
    updatedAt: '2026-06-15T16:45:00Z',
    detalles: [
      { id: 'd4', ordenId: 'ord_003', productoId: 'p1', productoNombre: 'Tarro Vidrio 500ml', cantidad: 200, precioUnitario: 12500, subtotal: 2500000 },
      { id: 'd5', ordenId: 'ord_003', productoId: 'p4', productoNombre: 'Vaso Vidrio 350ml',  cantidad: 80,  precioUnitario: 21250, subtotal: 1700000 },
    ],
  },
  {
    id: 'ord_004',
    numeroOrden: 'ORD-240004',
    administradorId: 'admin_1',
    proveedorId: 'prov_002',
    proveedorNombre: 'Green Pack Ltda.',
    estado: 'ACEPTADA',
    total: 1625000,
    createdAt: '2026-06-25T14:00:00Z',
    updatedAt: '2026-06-25T16:10:00Z',
    detalles: [
      { id: 'd6', ordenId: 'ord_004', productoId: 'p5', productoNombre: 'Caja Plástico 1.5L', cantidad: 50, precioUnitario: 32500, subtotal: 1625000 },
    ],
  },
  {
    id: 'ord_005',
    numeroOrden: 'ORD-240005',
    administradorId: 'admin_1',
    proveedorId: 'prov_001',
    proveedorNombre: 'EcoEnvases Colombia S.A.S',
    estado: 'CANCELADA',
    motivoCancelacion: 'Stock insuficiente en proveedor',
    total: 750000,
    createdAt: '2026-06-18T08:00:00Z',
    updatedAt: '2026-06-18T12:30:00Z',
    detalles: [
      { id: 'd7', ordenId: 'ord_005', productoId: 'p2', productoNombre: 'Bowl Acero 800ml', cantidad: 30, precioUnitario: 25000, subtotal: 750000 },
    ],
  },
  {
    id: 'ord_006',
    numeroOrden: 'ORD-240006',
    administradorId: 'admin_1',
    proveedorId: 'prov_001',
    proveedorNombre: 'EcoEnvases Colombia S.A.S',
    estado: 'EN_PREPARACION',
    total: 2100000,
    createdAt: '2026-06-26T10:00:00Z',
    updatedAt: '2026-06-27T08:00:00Z',
    detalles: [
      { id: 'd8', ordenId: 'ord_006', productoId: 'p3', productoNombre: 'Contenedor Bambú 1L', cantidad: 50, precioUnitario: 24500, subtotal: 1225000 },
      { id: 'd9', ordenId: 'ord_006', productoId: 'p5', productoNombre: 'Caja Plástico 1.5L',  cantidad: 27, precioUnitario: 32500, subtotal: 875000 },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
