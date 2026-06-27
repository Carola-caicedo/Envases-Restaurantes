import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Tooltip,
  Collapse,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  Build as PrepIcon,
  ListAlt as OrdersIcon,
  Close as CloseIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import type { OrdenCompra, EstadoOrden } from '../../types';

// ─── Paleta ────────────────────────────────────────────────────────────────────
const GREEN = {
  900: '#1a3a2a',
  800: '#1e4d35',
  700: '#246040',
  600: '#2d7a50',
  500: '#38a169',
  400: '#48bb78',
  300: '#68d391',
  200: '#9ae6b4',
  100: '#c6f6d5',
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

// ─── Config estados ────────────────────────────────────────────────────────────
const ESTADO_CONFIG: Record<EstadoOrden, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  PENDIENTE:       { label: 'Pendiente',       color: '#f6ad55', bg: '#f6ad5522', Icon: PendingIcon },
  ACEPTADA:        { label: 'Aceptada',         color: '#68d391', bg: '#68d39122', Icon: CheckIcon },
  EN_PREPARACION:  { label: 'En preparación',   color: '#63b3ed', bg: '#63b3ed22', Icon: PrepIcon },
  EN_TRANSITO:     { label: 'En tránsito',      color: '#9f7aea', bg: '#9f7aea22', Icon: ShippingIcon },
  COMPLETADA:      { label: 'Completada',        color: GREEN[400], bg: `${GREEN[500]}22`, Icon: CheckIcon },
  CANCELADA:       { label: 'Cancelada',         color: '#fc8181', bg: '#fc818122', Icon: CancelIcon },
};

// ─── Datos mock ────────────────────────────────────────────────────────────────
const MOCK_ORDERS: OrdenCompra[] = [
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
      { id: 'd1', ordenId: 'ord_001', productoId: 'p1', productoNombre: 'Tarro Vidrio 500ml', cantidad: 120, precioUnitario: 12500, subtotal: 1500000 },
      { id: 'd2', ordenId: 'ord_001', productoId: 'p2', productoNombre: 'Bowl Acero 800ml', cantidad: 60,  precioUnitario: 22500, subtotal: 1350000 },
    ],
  },
  {
    id: 'ord_002',
    numeroOrden: 'ORD-240002',
    administradorId: 'admin_1',
    proveedorId: 'prov_002',
    proveedorNombre: 'Green Pack Ltda.',
    estado: 'PENDIENTE',
    total: 980000,
    fechaLimiteRespuesta: '2026-06-28T09:15:00Z',
    createdAt: '2026-06-27T09:15:00Z',
    updatedAt: '2026-06-27T09:15:00Z',
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
    proveedorId: 'prov_002',
    proveedorNombre: 'Green Pack Ltda.',
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

// ─── Resumen de KPIs ───────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: `1px solid ${color}33`,
        background: `linear-gradient(135deg, ${color}11 0%, #161b22 100%)`,
        flex: 1,
        minWidth: 140,
      }}
    >
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 24 }}>{value}</Typography>
      {sub && <Typography sx={{ color, fontSize: 12, mt: 0.25 }}>{sub}</Typography>}
    </Paper>
  );
}

// ─── Badge de estado ───────────────────────────────────────────────────────────
function EstadoBadge({ estado }: { estado: EstadoOrden }) {
  const cfg = ESTADO_CONFIG[estado];
  return (
    <Chip
      icon={<cfg.Icon sx={{ fontSize: '14px !important', color: `${cfg.color} !important` }} />}
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}44`,
        fontWeight: 600,
        fontSize: 11,
        '& .MuiChip-icon': { ml: 0.75 },
      }}
    />
  );
}

// ─── Timeline de estados ───────────────────────────────────────────────────────
const ESTADO_STEPS: EstadoOrden[] = ['PENDIENTE', 'ACEPTADA', 'EN_PREPARACION', 'EN_TRANSITO', 'COMPLETADA'];

function OrderTimeline({ orden }: { orden: OrdenCompra }) {
  if (orden.estado === 'CANCELADA') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
        <CancelIcon sx={{ color: '#fc8181', fontSize: 20 }} />
        <Box>
          <Typography sx={{ color: '#fc8181', fontWeight: 600, fontSize: 14 }}>Orden cancelada</Typography>
          {orden.motivoCancelacion && (
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
              Motivo: {orden.motivoCancelacion}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  const currentIdx = ESTADO_STEPS.indexOf(orden.estado);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {ESTADO_STEPS.map((step, idx) => {
        const cfg = ESTADO_CONFIG[step];
        const isDone = idx <= currentIdx;
        const isLast = idx === ESTADO_STEPS.length - 1;

        return (
          <Box key={step} sx={{ display: 'flex', alignItems: 'center', flex: isLast ? 0 : 1 }}>
            <Tooltip title={cfg.label}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isDone ? cfg.bg : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${isDone ? cfg.color : 'rgba(255,255,255,0.12)'}`,
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                <cfg.Icon sx={{ fontSize: 14, color: isDone ? cfg.color : 'rgba(255,255,255,0.2)' }} />
              </Box>
            </Tooltip>
            {!isLast && (
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  bgcolor: idx < currentIdx ? GREEN[600] : 'rgba(255,255,255,0.1)',
                  mx: 0.5,
                  transition: 'all 0.3s',
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// ─── Fila expandible de la tabla ───────────────────────────────────────────────
function OrderRow({ orden, onView }: { orden: OrdenCompra; onView: (o: OrdenCompra) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        sx={{
          '&:hover': { bgcolor: `${GREEN[700]}11` },
          transition: 'background 0.15s',
          '& .MuiTableCell-root': { borderBottom: expanded ? 'none' : `1px solid ${GREEN[700]}22`, py: 1.8 },
          cursor: 'pointer',
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Expand */}
        <TableCell width={40} onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}>
          <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: GREEN[400] } }}>
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        </TableCell>

        {/* Número */}
        <TableCell>
          <Typography sx={{ color: GREEN[400], fontWeight: 700, fontSize: 14 }}>
            {orden.numeroOrden}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, mt: 0.25 }}>
            {formatDate(orden.createdAt)}
          </Typography>
        </TableCell>

        {/* Proveedor */}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: `${GREEN[700]}55`, fontSize: 12 }}>
              <StoreIcon sx={{ fontSize: 16, color: GREEN[400] }} />
            </Avatar>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
              {orden.proveedorNombre}
            </Typography>
          </Box>
        </TableCell>

        {/* Estado */}
        <TableCell>
          <EstadoBadge estado={orden.estado} />
        </TableCell>

        {/* Timeline */}
        <TableCell sx={{ minWidth: 220 }}>
          <OrderTimeline orden={orden} />
        </TableCell>

        {/* Envío */}
        <TableCell align="center">
          {orden.numeroEnvio ? (
            <Chip
              label={orden.numeroEnvio}
              size="small"
              icon={<ShippingIcon sx={{ fontSize: '13px !important', color: '#9f7aea !important' }} />}
              sx={{
                bgcolor: '#9f7aea22',
                color: '#9f7aea',
                border: '1px solid #9f7aea44',
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          ) : (
            <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>—</Typography>
          )}
        </TableCell>

        {/* Total */}
        <TableCell align="right">
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
            {formatCurrency(orden.total)}
          </Typography>
        </TableCell>

        {/* Acciones */}
        <TableCell align="center">
          <Tooltip title="Ver detalle">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onView(orden); }}
              sx={{
                color: 'rgba(255,255,255,0.4)',
                '&:hover': { color: GREEN[400], bgcolor: `${GREEN[600]}22` },
                borderRadius: 1.5,
              }}
            >
              <ViewIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Fila expandida: detalles de productos */}
      <TableRow>
        <TableCell colSpan={8} sx={{ p: 0, border: 'none' }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box
              sx={{
                px: 7,
                py: 2,
                bgcolor: `${GREEN[900]}55`,
                borderBottom: `1px solid ${GREEN[700]}22`,
              }}
            >
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Detalle de productos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {orden.detalles.map((d) => (
                  <Box
                    key={d.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: '#161b22',
                      border: `1px solid ${GREEN[700]}22`,
                    }}
                  >
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, flex: 1 }}>
                      {d.productoNombre}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                        {d.cantidad} und × {formatCurrency(d.precioUnitario)}
                      </Typography>
                      <Typography sx={{ color: GREEN[400], fontWeight: 700, fontSize: 13, minWidth: 100, textAlign: 'right' }}>
                        {formatCurrency(d.subtotal)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              {orden.motivoCancelacion && (
                <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: '#fc818111', border: '1px solid #fc818133' }}>
                  <Typography sx={{ color: '#fc8181', fontSize: 13 }}>
                    <strong>Motivo de cancelación:</strong> {orden.motivoCancelacion}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ─── Modal de detalle de orden ─────────────────────────────────────────────────
function OrderDetailModal({ orden, onClose }: { orden: OrdenCompra | null; onClose: () => void }) {
  if (!orden) return null;
  const cfg = ESTADO_CONFIG[orden.estado];

  return (
    <Dialog
      open={!!orden}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#161b22',
          border: `1px solid ${GREEN[700]}55`,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 18 }}>
            {orden.numeroOrden}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            Creada el {formatDate(orden.createdAt)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <EstadoBadge estado={orden.estado} />
          <IconButton size="small" onClick={onClose} sx={{ color: 'rgba(255,255,255,0.4)' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Proveedor */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 2,
            borderRadius: 2,
            bgcolor: `${GREEN[700]}22`,
            border: `1px solid ${GREEN[600]}33`,
            mb: 2.5,
          }}
        >
          <Avatar sx={{ bgcolor: GREEN[600], width: 36, height: 36 }}>
            <StoreIcon />
          </Avatar>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Proveedor</Typography>
            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{orden.proveedorNombre}</Typography>
          </Box>
        </Box>

        {/* Timeline visual */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Progreso de la orden
          </Typography>
          <OrderTimeline orden={orden} />
        </Box>

        {/* Info adicional */}
        {orden.numeroEnvio && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, borderRadius: 2, bgcolor: '#9f7aea22', border: '1px solid #9f7aea44' }}>
            <ShippingIcon sx={{ color: '#9f7aea', fontSize: 18 }} />
            <Typography sx={{ color: '#9f7aea', fontSize: 13 }}>
              Número de envío: <strong>{orden.numeroEnvio}</strong>
            </Typography>
          </Box>
        )}

        {/* Productos */}
        <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Productos ({orden.detalles.length})
        </Typography>
        <Stack gap={1} sx={{ mb: 2.5 }}>
          {orden.detalles.map((d) => (
            <Box
              key={d.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 2,
                bgcolor: '#0d1117',
                border: `1px solid ${GREEN[700]}22`,
              }}
            >
              <Box>
                <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 500 }}>{d.productoNombre}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  {d.cantidad} und × {formatCurrency(d.precioUnitario)}
                </Typography>
              </Box>
              <Typography sx={{ color: GREEN[400], fontWeight: 700 }}>{formatCurrency(d.subtotal)}</Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ borderColor: `${GREEN[700]}33`, mb: 2 }} />

        {/* Total */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>Total de la orden</Typography>
          <Typography sx={{ color: GREEN[400], fontWeight: 800, fontSize: 22 }}>
            {formatCurrency(orden.total)}
          </Typography>
        </Box>

        {orden.motivoCancelacion && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#fc818111', border: '1px solid #fc818133' }}>
            <Typography sx={{ color: '#fc8181', fontSize: 13 }}>
              <strong>Motivo de cancelación:</strong> {orden.motivoCancelacion}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: `${GREEN[600]}55`, color: 'rgba(255,255,255,0.5)' }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Página principal: OrdenesPage ────────────────────────────────────────────
export default function OrdenesPage() {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoOrden | 'TODOS'>('TODOS');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<OrdenCompra | null>(null);
  const [loading, setLoading] = useState(false);

  // KPIs
  const totalOrdenes = MOCK_ORDERS.length;
  const ordenesPendientes = MOCK_ORDERS.filter((o) => o.estado === 'PENDIENTE').length;
  const ordenesCompletadas = MOCK_ORDERS.filter((o) => o.estado === 'COMPLETADA').length;
  const totalGastado = MOCK_ORDERS.filter((o) => o.estado !== 'CANCELADA').reduce((s, o) => s + o.total, 0);

  // Filtrado + búsqueda
  const filtered = useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      const matchesSearch =
        o.numeroOrden.toLowerCase().includes(search.toLowerCase()) ||
        o.proveedorNombre.toLowerCase().includes(search.toLowerCase()) ||
        (o.numeroEnvio ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesEstado = filtroEstado === 'TODOS' || o.estado === filtroEstado;
      return matchesSearch && matchesEstado;
    });
  }, [search, filtroEstado]);

  const paginated = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <Box>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <OrdersIcon sx={{ color: GREEN[400], fontSize: 28 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              Órdenes de compra
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Seguimiento y gestión de todas las órdenes de envases
          </Typography>
        </Box>
        <Tooltip title="Actualizar">
          <IconButton
            onClick={handleRefresh}
            sx={{
              color: 'rgba(255,255,255,0.5)',
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: 2,
              '&:hover': { color: GREEN[400], borderColor: GREEN[600], bgcolor: `${GREEN[600]}11` },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── KPIs ─────────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <KpiCard label="Total órdenes" value={totalOrdenes} sub="Histórico" color={GREEN[500]} />
        <KpiCard label="Pendientes" value={ordenesPendientes} sub="Esperando respuesta" color="#f6ad55" />
        <KpiCard label="Completadas" value={ordenesCompletadas} sub="Recibidas correctamente" color="#68d391" />
        <KpiCard label="Total invertido" value={formatCurrency(totalGastado)} sub="Sin canceladas" color="#63b3ed" />
      </Box>

      {/* ── Tabla ─────────────────────────────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${GREEN[700]}33`,
          background: '#161b22',
          overflow: 'hidden',
        }}
      >
        {/* Barra de herramientas */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
            borderBottom: `1px solid ${GREEN[700]}33`,
            background: `linear-gradient(90deg, ${GREEN[900]}99, #161b22)`,
          }}
        >
          <TextField
            id="ordenes-search"
            placeholder="Buscar por número, proveedor o tracking…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            size="small"
            sx={{
              flex: 1,
              minWidth: 240,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: `${GREEN[600]}44` },
                '&:hover fieldset': { borderColor: GREEN[500] },
                '&.Mui-focused fieldset': { borderColor: GREEN[400] },
                bgcolor: `${GREEN[700]}22`,
                color: 'white',
                fontSize: 14,
              },
              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.3)' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel
              id="filtro-estado-label"
              sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: GREEN[400] } }}
            >
              Estado
            </InputLabel>
            <Select
              labelId="filtro-estado-label"
              id="filtro-estado"
              value={filtroEstado}
              label="Estado"
              onChange={(e) => { setFiltroEstado(e.target.value as EstadoOrden | 'TODOS'); setPage(0); }}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: `${GREEN[600]}44` },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: GREEN[500] },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: GREEN[400] },
                bgcolor: `${GREEN[700]}22`,
                color: 'white',
                fontSize: 14,
              }}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: '#1a2332', border: `1px solid ${GREEN[700]}55`, borderRadius: 2 },
                },
              }}
            >
              <MenuItem value="TODOS" sx={{ color: 'white', '&:hover': { bgcolor: `${GREEN[600]}22` } }}>
                Todos los estados
              </MenuItem>
              {(Object.keys(ESTADO_CONFIG) as EstadoOrden[]).map((e) => (
                <MenuItem key={e} value={e} sx={{ color: ESTADO_CONFIG[e].color, '&:hover': { bgcolor: `${GREEN[600]}22` } }}>
                  {ESTADO_CONFIG[e].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <FilterIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        {/* Loading bar */}
        {loading && <LinearProgress sx={{ bgcolor: `${GREEN[700]}44`, '& .MuiLinearProgress-bar': { bgcolor: GREEN[500] } }} />}

        {/* Tabla */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  '& .MuiTableCell-head': {
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    borderBottom: `1px solid ${GREEN[700]}33`,
                    py: 1.5,
                    bgcolor: `${GREEN[900]}55`,
                  },
                }}
              >
                <TableCell width={40} />
                <TableCell>Orden</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Progreso</TableCell>
                <TableCell align="center">N° Envío</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8, color: 'rgba(255,255,255,0.3)', borderBottom: 'none' }}>
                    <OrdersIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1, display: 'block', mx: 'auto' }} />
                    No se encontraron órdenes con los filtros actuales
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((orden) => (
                  <OrderRow key={orden.id} orden={orden} onView={setSelectedOrder} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
          sx={{
            color: 'rgba(255,255,255,0.5)',
            borderTop: `1px solid ${GREEN[700]}33`,
            '& .MuiTablePagination-select': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.5)' },
            '& .MuiIconButton-root': { color: 'rgba(255,255,255,0.5)', '&:hover': { color: GREEN[400] } },
            '& .MuiIconButton-root.Mui-disabled': { color: 'rgba(255,255,255,0.2)' },
          }}
        />
      </Paper>

      {/* Modal detalle */}
      <OrderDetailModal orden={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </Box>
  );
}
