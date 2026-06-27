import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Tooltip,
  LinearProgress,
  Stack,
} from '@mui/material';
import AcceptIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import ViewIcon from '@mui/icons-material/VisibilityOutlined';
import AlertIcon from '@mui/icons-material/NotificationsActive';
import OrdersIcon from '@mui/icons-material/ListAlt';
import TimerIcon from '@mui/icons-material/AccessTime';
import { toast } from 'react-toastify';
import type { OrdenCompra, EstadoOrden } from '../../types';
import { MOCK_ORDENES, ESTADO_CONFIG, formatCurrency, formatDate } from '../../data/mockOrdenes';

// ─── Paleta ────────────────────────────────────────────────────────────────────
const GREEN = {
  900: '#1a3a2a', 800: '#1e4d35', 700: '#246040',
  600: '#2d7a50', 500: '#38a169', 400: '#48bb78',
  300: '#68d391', 200: '#9ae6b4', 100: '#c6f6d5',
};

// ─── Hook contador regresivo ───────────────────────────────────────────────────
function useCountdown(targetIso?: string) {
  const calcRemaining = useCallback(() => {
    if (!targetIso) return null;
    const diff = new Date(targetIso).getTime() - Date.now();
    if (diff <= 0) return { expired: true, h: 0, m: 0, s: 0, pct: 0 };
    const total = 24 * 60 * 60 * 1000;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pct = Math.min(100, (diff / total) * 100);
    return { expired: false, h, m, s, pct };
  }, [targetIso]);

  const [time, setTime] = useState(calcRemaining);

  useEffect(() => {
    if (!targetIso) return;
    const id = setInterval(() => setTime(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [targetIso, calcRemaining]);

  return time;
}

// ─── Badge de estado ───────────────────────────────────────────────────────────
function EstadoBadge({ estado }: { estado: EstadoOrden }) {
  const cfg = ESTADO_CONFIG[estado];
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}44`,
        fontWeight: 600,
        fontSize: 11,
      }}
    />
  );
}

// ─── Card individual de orden ──────────────────────────────────────────────────
interface PedidoCardProps {
  orden: OrdenCompra;
  onAceptar: (id: string) => void;
  onCancelar: (id: string) => void;
}

function PedidoCard({ orden, onAceptar, onCancelar }: PedidoCardProps) {
  const navigate = useNavigate();
  const countdown = useCountdown(orden.fechaLimiteRespuesta);
  const isPending = orden.estado === 'PENDIENTE';
  const isActionable = ['ACEPTADA', 'EN_PREPARACION'].includes(orden.estado);
  const isInTransit = orden.estado === 'EN_TRANSITO';
  const isDone = ['COMPLETADA', 'CANCELADA'].includes(orden.estado);

  const timerColor =
    countdown && !countdown.expired
      ? countdown.h < 4
        ? '#fc8181'
        : countdown.h < 12
          ? '#f6ad55'
          : '#68d391'
      : '#fc8181';

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${
          isPending
            ? '#f6ad5544'
            : isInTransit
              ? '#9f7aea44'
              : isDone && orden.estado === 'CANCELADA'
                ? '#fc818133'
                : `${GREEN[700]}44`
        }`,
        background: `linear-gradient(135deg, #161b22 0%, #1a2332 100%)`,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
        },
      }}
    >
      {/* Barra superior de estado */}
      <Box
        sx={{
          height: 3,
          bgcolor:
            ESTADO_CONFIG[orden.estado].color + '88',
          backgroundImage: isPending
            ? `repeating-linear-gradient(45deg, transparent, transparent 6px, ${ESTADO_CONFIG[orden.estado].color}44 6px, ${ESTADO_CONFIG[orden.estado].color}44 12px)`
            : undefined,
        }}
      />

      <Box sx={{ p: 2.5 }}>
        {/* ── Encabezado ─────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography sx={{ color: GREEN[400], fontWeight: 800, fontSize: 16 }}>
              {orden.numeroOrden}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, mt: 0.25 }}>
              Recibida: {formatDate(orden.createdAt)}
            </Typography>
          </Box>
          <EstadoBadge estado={orden.estado} />
        </Box>

        {/* ── Timer si está pendiente ─────────────────────────── */}
        {isPending && countdown && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${timerColor}11`,
              border: `1px solid ${timerColor}33`,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {countdown.expired ? (
                <AlertIcon sx={{ color: '#fc8181', fontSize: 16 }} />
              ) : (
                <TimerIcon sx={{ color: timerColor, fontSize: 16 }} />
              )}
              <Typography sx={{ color: timerColor, fontSize: 12, fontWeight: 600 }}>
                {countdown.expired
                  ? '⚠ Tiempo de respuesta expirado'
                  : `Tiempo para responder: ${String(countdown.h).padStart(2, '0')}:${String(countdown.m).padStart(2, '0')}:${String(countdown.s).padStart(2, '0')}`}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={countdown.expired ? 0 : countdown.pct}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': { bgcolor: timerColor, borderRadius: 2 },
              }}
            />
          </Box>
        )}

        {/* ── Número de envío si está en tránsito ─────────────── */}
        {isInTransit && orden.numeroEnvio && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#9f7aea22',
              border: '1px solid #9f7aea44',
              mb: 2,
            }}
          >
            <ShippingIcon sx={{ color: '#9f7aea', fontSize: 18 }} />
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Número de guía</Typography>
              <Typography sx={{ color: '#9f7aea', fontWeight: 700, fontSize: 14 }}>
                {orden.numeroEnvio}
              </Typography>
            </Box>
          </Box>
        )}

        {/* ── Productos ───────────────────────────────────────── */}
        <Box sx={{ mb: 2 }}>
          {orden.detalles.map((d) => (
            <Box
              key={d.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 0.75,
                borderBottom: `1px solid rgba(255,255,255,0.05)`,
              }}
            >
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                {d.productoNombre}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  label={`${d.cantidad} und`}
                  size="small"
                  sx={{ bgcolor: `${GREEN[700]}33`, color: GREEN[300], fontSize: 11, height: 20 }}
                />
                <Typography sx={{ color: GREEN[400], fontWeight: 600, fontSize: 13, minWidth: 80, textAlign: 'right' }}>
                  {formatCurrency(d.subtotal)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />

        {/* ── Total + acciones ────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Total del pedido</Typography>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 18 }}>
              {formatCurrency(orden.total)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Ver detalle siempre disponible */}
            <Tooltip title="Ver detalle completo">
              <Button
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => navigate(`/proveedor/pedidos/${orden.id}`)}
                variant="outlined"
                sx={{
                  borderColor: `${GREEN[600]}55`,
                  color: GREEN[400],
                  '&:hover': { borderColor: GREEN[400], bgcolor: `${GREEN[600]}11` },
                  borderRadius: 2,
                  fontSize: 12,
                }}
              >
                Detalle
              </Button>
            </Tooltip>

            {/* Aceptar / Cancelar para PENDIENTE */}
            {isPending && (
              <>
                <Button
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={() => onCancelar(orden.id)}
                  sx={{
                    borderRadius: 2,
                    color: '#fc8181',
                    border: '1px solid #fc818133',
                    '&:hover': { bgcolor: '#fc818111', border: '1px solid #fc818166' },
                    fontSize: 12,
                  }}
                >
                  Rechazar
                </Button>
                <Button
                  size="small"
                  startIcon={<AcceptIcon />}
                  onClick={() => onAceptar(orden.id)}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    bgcolor: GREEN[500],
                    '&:hover': { bgcolor: GREEN[400] },
                    fontSize: 12,
                    boxShadow: `0 2px 8px ${GREEN[700]}88`,
                  }}
                >
                  Aceptar
                </Button>
              </>
            )}

            {/* Gestionar envío para ACEPTADA / EN_PREPARACION */}
            {isActionable && (
              <Button
                size="small"
                startIcon={<ShippingIcon />}
                onClick={() => navigate(`/proveedor/pedidos/${orden.id}`)}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  bgcolor: '#63b3ed',
                  '&:hover': { bgcolor: '#4299e1' },
                  fontSize: 12,
                }}
              >
                Gestionar envío
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────
export default function PedidosPage() {
  // Para el demo: simulamos que el proveedor logueado tiene id 'prov_001'
  const PROVEEDOR_ID = 'prov_001';

  const [ordenes, setOrdenes] = useState<OrdenCompra[]>(
    MOCK_ORDENES.filter((o) => o.proveedorId === PROVEEDOR_ID),
  );
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelMotivo, setCancelMotivo] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleAceptar = async (id: string) => {
    await new Promise((r) => setTimeout(r, 600));
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, estado: 'ACEPTADA' as EstadoOrden, updatedAt: new Date().toISOString() } : o,
      ),
    );
    toast.success('Pedido aceptado correctamente. El administrador ha sido notificado.');
  };

  const handleCancelar = async () => {
    if (!cancelTarget || !cancelMotivo.trim()) return;
    setCancelLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === cancelTarget
          ? { ...o, estado: 'CANCELADA' as EstadoOrden, motivoCancelacion: cancelMotivo, updatedAt: new Date().toISOString() }
          : o,
      ),
    );
    setCancelLoading(false);
    setCancelTarget(null);
    setCancelMotivo('');
    toast.info('Pedido rechazado. El administrador ha sido notificado.');
  };

  const pendientes = ordenes.filter((o) => o.estado === 'PENDIENTE').length;
  const enProceso  = ordenes.filter((o) => ['ACEPTADA', 'EN_PREPARACION', 'EN_TRANSITO'].includes(o.estado)).length;
  const completadas = ordenes.filter((o) => o.estado === 'COMPLETADA').length;

  return (
    <Box>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <OrdersIcon sx={{ color: GREEN[400], fontSize: 28 }} />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
            Mis Pedidos
          </Typography>
          {pendientes > 0 && (
            <Chip
              label={`${pendientes} requiere${pendientes > 1 ? 'n' : ''} respuesta`}
              size="small"
              icon={<AlertIcon sx={{ fontSize: '14px !important', color: '#f6ad55 !important' }} />}
              sx={{ bgcolor: '#f6ad5522', color: '#f6ad55', border: '1px solid #f6ad5544', fontWeight: 600, fontSize: 11 }}
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Gestiona los pedidos recibidos, acepta o rechaza, y coordina el despacho
        </Typography>
      </Box>

      {/* ── KPIs ─────────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Pendientes de respuesta', value: pendientes, color: '#f6ad55' },
          { label: 'En proceso',              value: enProceso,  color: '#63b3ed' },
          { label: 'Completados',             value: completadas, color: GREEN[400] },
          { label: 'Total pedidos',           value: ordenes.length, color: 'rgba(255,255,255,0.5)' },
        ].map((k) => (
          <Paper
            key={k.label}
            elevation={0}
            sx={{
              flex: 1,
              minWidth: 140,
              p: 2,
              borderRadius: 3,
              border: `1px solid ${k.color}33`,
              background: `linear-gradient(135deg, ${k.color}11 0%, #161b22 100%)`,
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {k.label}
            </Typography>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>
              {k.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* ── Lista de pedidos ──────────────────────────────────────────────────── */}
      <Stack spacing={2.5}>
        {ordenes.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: `1px dashed ${GREEN[700]}55`, bgcolor: '#161b22' }}>
            <OrdersIcon sx={{ fontSize: 56, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No tienes pedidos asignados aún</Typography>
          </Paper>
        ) : (
          // Ordenar: PENDIENTE primero, luego en proceso, luego completados/cancelados
          [...ordenes]
            .sort((a, b) => {
              const priority: Record<EstadoOrden, number> = {
                PENDIENTE: 0, EN_PREPARACION: 1, ACEPTADA: 2, EN_TRANSITO: 3, COMPLETADA: 4, CANCELADA: 5,
              };
              return priority[a.estado] - priority[b.estado];
            })
            .map((orden) => (
              <PedidoCard
                key={orden.id}
                orden={orden}
                onAceptar={handleAceptar}
                onCancelar={(id) => setCancelTarget(id)}
              />
            ))
        )}
      </Stack>

      {/* ── Diálogo de cancelación ─────────────────────────────────────────── */}
      <Dialog
        open={!!cancelTarget}
        onClose={() => { setCancelTarget(null); setCancelMotivo(''); }}
        slotProps={{
          paper: {
            sx: { bgcolor: '#161b22', border: '1px solid #fc818133', borderRadius: 3, minWidth: 400 }
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Rechazar pedido</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, mb: 2 }}>
            Indica el motivo del rechazo. El administrador recibirá una notificación con esta información.
          </DialogContentText>
          <TextField
            variant="outlined"
            id="cancel-motivo"
            fullWidth
            multiline
            rows={3}
            label="Motivo del rechazo"
            value={cancelMotivo}
            onChange={(e) => setCancelMotivo(e.target.value)}
            placeholder="Ej: Stock agotado, producto descontinuado..."
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                '&:hover fieldset': { borderColor: '#fc818166' },
                '&.Mui-focused fieldset': { borderColor: '#fc8181' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#fc8181' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => { setCancelTarget(null); setCancelMotivo(''); }} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Volver
          </Button>
          <Button
            variant="contained"
            disabled={!cancelMotivo.trim() || cancelLoading}
            onClick={handleCancelar}
            sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' }, borderRadius: 2 }}
          >
            {cancelLoading ? 'Enviando...' : 'Confirmar rechazo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
