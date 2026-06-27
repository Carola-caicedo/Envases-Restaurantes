// ─── Roles del sistema ────────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'CAJERO' | 'OPERARIO' | 'PROVEEDOR' | 'CLIENTE';

// ─── Usuario autenticado ───────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  restauranteId?: string;
}

// ─── Tokens JWT ───────────────────────────────────────────────────────────────
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

// ─── Nav item para el Sidebar ─────────────────────────────────────────────────
export interface NavItem {
  label: string;
  path: string;
  icon: string; // nombre del icono de MUI Icons
  roles: UserRole[];
  children?: NavItem[];
}

// ─── Respuesta API genérica ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// ─── Paginación ───────────────────────────────────────────────────────────────
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ─── Proveedor ────────────────────────────────────────────────────────────────
export interface ProveedorPerfil {
  id: string;
  usuarioId: string;
  nombreEmpresa: string;
  descripcion: string;
  direccion: string;
  condicionesComerciales: string;
  catalogoActivo: boolean;
  createdAt: string;
}

export interface ProductoCatalogo {
  id: string;
  proveedorId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  material: string;
  capacidadMl: number;
  maxUsosEstimado: number;
  imagenUrl: string;
  activo: boolean;
}

export type MaterialEnvase = 'VIDRIO' | 'ACERO_INOXIDABLE' | 'PLASTICO_REUTILIZABLE' | 'BAMBU' | 'CERAMICA';

// ─── Carrito de compras ───────────────────────────────────────────────────────
export interface CartItem {
  producto: ProductoCatalogo;
  cantidad: number;
}

// ─── Órdenes de compra ────────────────────────────────────────────────────────
export type EstadoOrden =
  | 'PENDIENTE'
  | 'ACEPTADA'
  | 'EN_PREPARACION'
  | 'EN_TRANSITO'
  | 'COMPLETADA'
  | 'CANCELADA';

export interface DetalleOrden {
  id: string;
  ordenId: string;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface OrdenCompra {
  id: string;
  numeroOrden: string;
  administradorId: string;
  proveedorId: string;
  proveedorNombre: string;
  estado: EstadoOrden;
  numeroEnvio?: string;
  total: number;
  motivoCancelacion?: string;
  fechaLimiteRespuesta?: string;
  createdAt: string;
  updatedAt: string;
  detalles: DetalleOrden[];
}


