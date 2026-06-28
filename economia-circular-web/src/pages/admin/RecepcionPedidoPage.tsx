import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  LinearProgress,
  Stack,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/CheckCircle';
import CheckEmptyIcon from '@mui/icons-material/RadioButtonUnchecked';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import BoxIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import QrIcon from '@mui/icons-material/QrCode';
import ReceiveIcon from '@mui/icons-material/AssignmentTurnedIn';
import WarnIcon from '@mui/icons-material/Warning';
import { toast } from 'react-toastify';
import type { EstadoOrden } from '../../types';
import { MOCK_ORDENES, ESTADO_CONFIG, formatCurrency, formatDate } from '../../data/mockOrdenes';

// ─── Paleta ────────────────────────────────────────────────────────────────────
const GREEN = {
  900: '#1a3a2a', 800: '#1e4d35', 700: '#246040',
  600: '#2d7a50', 500: '#38a169', 400: '#48bb78', 300: '#68d391',
};

// ─── Pasos del flujo ───────────────────────────────────────────────────────────
const STEPS = ['Pendiente', 'Aceptada', 'En preparación', 'En tránsito', 'Completada'];
const STEP_ESTADOS: EstadoOrden[] = ['PENDIENTE', 'ACEPTADA', 'EN_PREPARACION', 'EN_TRANSITO', 'COMPLETADA'];

// ─── Item del checklist ────────────────────────────────────────────────────────
interface ChecklistItem {
  id: string;
  productoNombre: string;
  cantidad: number;
  cantidadVerificada: number;
  checked: boolean;
}

// ─── Componente: Checklist de recepción ───────────────────────────────────────
interface ChecklistProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  onUpdateCantidad: (id: string, cant: number) => void;
  readonly?: boolean;
}

function ChecklistRecepcion({ items, onToggle, readonly }: ChecklistProps) {
  const allChecked = items.every((i) => i.checked);
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <Box>
      {/* Barra de progreso */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
          Progreso de verificación
        </Typography>
        <Typography sx={{ color: allChecked ? GREEN[400] : '#f6ad55', fontWeight: 700, fontSize: 12 }}>
          {checkedCount}/{items.length} verificado{checkedCount !== 1 ? 's' : ''}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(checkedCount / items.length) * 100}
        sx={{
          height: 6,
          borderRadius: 3,
          mb: 2.5,
          bgcolor: 'rgba(255,255,255,0.08)',
          '& .MuiLinearProgress-bar': {
            bgcolor: allChecked ? GREEN[500] : '#f6ad55',
            borderRadius: 3,
            transition: 'all 0.3s',
          },
        }}
      />

      <Stack spacing={1.5}>
        {items.map((item) => (
          <Box
            key={item.id}
            onClick={() => !readonly && onToggle(item.id)}
            sx={{
              p: 2,
              borderRadius: 2.5,
              border: `1.5px solid ${item.checked ? `${GREEN[500]}66` : 'rgba(255,255,255,0.08)'}`,
              bgcolor: item.checked ? `${GREEN[700]}22` : '#0d1117',
              cursor: readonly ? 'default' : 'pointer',
              transition: 'all 0.2s',
              '&:hover': readonly
                ? {}
                : {
                    border: `1.5px solid ${item.checked ? `${GREEN[400]}88` : 'rgba(255,255,255,0.18)'}`,
                    bgcolor: item.checked ? `${GREEN[700]}33` : 'rgba(255,255,255,0.03)',
                  },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Checkbox visual */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: `2px solid ${item.checked ? GREEN[500] : 'rgba(255,255,255,0.2)'}`,
                  bgcolor: item.checked ? `${GREEN[500]}22` : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {item.checked ? (
                  <CheckIcon sx={{ color: GREEN[400], fontSize: 18 }} />
                ) : (
                  <CheckEmptyIcon sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }} />
                )}
              </Box>

              {/* Info del producto */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: item.checked ? 'white' : 'rgba(255,255,255,0.75)',
                    fontWeight: item.checked ? 600 : 400,
                    fontSize: 14,
                    textDecoration: item.checked ? 'none' : 'none',
                  }}
                >
                  {item.productoNombre}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  Esperado: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{item.cantidad} unidades</strong>
                </Typography>
              </Box>

              {/* Badge de estado */}
              <Chip
                label={item.checked ? 'Verificado ✓' : 'Pendiente'}
                size="small"
                sx={{
                  bgcolor: item.checked ? `${GREEN[500]}22` : 'rgba(255,255,255,0.06)',
                  color: item.checked ? GREEN[400] : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${item.checked ? `${GREEN[500]}44` : 'rgba(255,255,255,0.08)'}`,
                  fontWeight: 600,
                  fontSize: 11,
                  transition: 'all 0.2s',
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// ─── Página principal: RecepcionPedidoPage ────────────────────────────────────
export default function RecepcionPedidoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ordenes, setOrdenes] = useState(MOCK_ORDENES);
  const orden = ordenes.find((o) => o.id === id);

  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    () =>
      orden?.detalles.map((d) => ({
        id: d.id,
        productoNombre: d.productoNombre,
        cantidad: d.cantidad,
        cantidadVerificada: d.cantidad,
        checked: false,
      })) ?? [],
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!orden) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>
          Orden no encontrada
        </Typography>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/admin/ordenes')}
          sx={{ mt: 2, color: GREEN[400] }}
        >
          Volver a órdenes
        </Button>
      </Box>
    );
  }

  const stepIndex = STEP_ESTADOS.indexOf(orden.estado);
  const activeStep = orden.estado === 'CANCELADA' ? -1 : stepIndex;
  const cfg = ESTADO_CONFIG[orden.estado];
  const allChecked = checklist.every((i) => i.checked);
  const checkedCount = checklist.filter((i) => i.checked).length;
  const canReceive = orden.estado === 'EN_TRANSITO';

  const handleToggle = (id: string) => {
    setChecklist((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  const handleConfirmReceive = async () => {
    setConfirmOpen(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === orden.id
          ? { ...o, estado: 'COMPLETADA' as EstadoOrden, updatedAt: new Date().toISOString() }
          : o,
      ),
    );
    setLoading(false);
    setCompleted(true);
    toast.success(`Recepción confirmada. Los ${checklist.reduce((s, i) => s + i.cantidad, 0)} envases han ingresado al inventario.`);
  };

  // ── Pantalla de éxito ──────────────────────────────────────────────────────
  if (completed) {
    const totalEnvases = checklist.reduce((s, i) => s + i.cantidad, 0);
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: `${GREEN[500]}22`,
            border: `3px solid ${GREEN[400]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            animation: 'pulse 1.5s ease-in-out',
          }}
        >
          <CheckIcon sx={{ fontSize: 52, color: GREEN[400] }} />
        </Box>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
          ¡Recepción confirmada!
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
          Orden <strong style={{ color: GREEN[400] }}>{orden.numeroOrden}</strong> marcada como Completada
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, mb: 4, textAlign: 'center', maxWidth: 360 }}>
          <strong style={{ color: GREEN[300] }}>{totalEnvases} envases</strong> han sido registrados
          en el inventario con sus códigos QR asignados.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/ordenes')}
            sx={{ borderColor: `${GREEN[600]}55`, color: GREEN[400], borderRadius: 2 }}
          >
            Ver todas las órdenes
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/admin/inventario')}
            sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2 }}
          >
            Ir al inventario
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/admin/ordenes')}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: GREEN[400] }, borderRadius: 2 }}
        >
          Órdenes
        </Button>
        <Typography sx={{ color: 'rgba(255,255,255,0.2)' }}>/</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>{orden.numeroOrden}</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.2)' }}>/</Typography>
        <Typography sx={{ color: GREEN[400], fontWeight: 600, fontSize: 14 }}>Confirmar recepción</Typography>
      </Box>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <ReceiveIcon sx={{ color: GREEN[400], fontSize: 28 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              Confirmar recepción de pedido
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            {orden.numeroOrden} · {orden.proveedorNombre} · Recibida el {formatDate(orden.createdAt)}
          </Typography>
        </Box>
        <Chip
          label={cfg.label}
          sx={{ bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`, fontWeight: 700, fontSize: 13, px: 1 }}
        />
      </Box>

      {/* ── Aviso si no está en tránsito ─────────────────────────────────── */}
      {!canReceive && orden.estado !== 'COMPLETADA' && (
        <Alert
          severity="warning"
          icon={<WarnIcon />}
          sx={{ mb: 3, bgcolor: '#2d2000', border: '1px solid #f6ad5533', color: '#f6ad55', borderRadius: 2 }}
        >
          Esta orden aún no está en estado <strong>En tránsito</strong>. Solo puedes confirmar
          recepción cuando el proveedor haya despachado el pedido.
        </Alert>
      )}
      {orden.estado === 'COMPLETADA' && (
        <Alert
          severity="success"
          icon={<CheckIcon />}
          sx={{ mb: 3, bgcolor: `${GREEN[700]}22`, border: `1px solid ${GREEN[500]}33`, color: GREEN[300], borderRadius: 2 }}
        >
          Esta orden ya fue <strong>completada y recibida</strong>. Los envases están en el inventario.
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 3 }}>
        {/* ── Columna izquierda ────────────────────────────────────────────── */}
        <Stack spacing={3}>
          {/* Stepper */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${GREEN[700]}33`, bgcolor: '#161b22' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Estado actual del pedido
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
              {STEPS.map((label, idx) => (
                <Step key={label} completed={idx < activeStep}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: idx <= activeStep ? 'white' : 'rgba(255,255,255,0.3)',
                        fontSize: 11,
                        fontWeight: idx === activeStep ? 700 : 400,
                        mt: 0.5,
                      },
                      '& .MuiStepIcon-root': {
                        color: idx < activeStep ? GREEN[500] : idx === activeStep ? GREEN[400] : 'rgba(255,255,255,0.15)',
                        fontSize: 28,
                      },
                      '& .MuiStepIcon-root.Mui-active': { color: GREEN[400] },
                      '& .MuiStepIcon-root.Mui-completed': { color: GREEN[500] },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Checklist */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${GREEN[700]}33`, bgcolor: '#161b22' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <BoxIcon sx={{ color: GREEN[400], fontSize: 20 }} />
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                Checklist de productos recibidos
              </Typography>
            </Box>

            {canReceive ? (
              <>
                <Alert
                  severity="info"
                  sx={{ mb: 2.5, bgcolor: '#1a2332', border: '1px solid #63b3ed33', color: '#63b3ed', borderRadius: 2, fontSize: 13 }}
                >
                  Verifica físicamente cada producto y márcalo como recibido antes de confirmar.
                </Alert>
                <ChecklistRecepcion
                  items={checklist}
                  onToggle={handleToggle}
                  onUpdateCantidad={() => {}}
                />
              </>
            ) : (
              <ChecklistRecepcion
                items={checklist.map((i) => ({ ...i, checked: orden.estado === 'COMPLETADA' }))}
                onToggle={() => {}}
                onUpdateCantidad={() => {}}
                readonly
              />
            )}
          </Paper>
        </Stack>

        {/* ── Panel lateral ─────────────────────────────────────────────────── */}
        <Stack spacing={3}>
          {/* Resumen del pedido */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${GREEN[700]}33`, bgcolor: '#161b22' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Resumen del pedido
            </Typography>

            {/* Proveedor */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ bgcolor: GREEN[600], width: 36, height: 36 }}>
                <StoreIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Proveedor</Typography>
                <Typography sx={{ color: 'white', fontWeight: 600 }}>{orden.proveedorNombre}</Typography>
              </Box>
            </Box>

            {/* Número de guía */}
            {orden.numeroEnvio && (
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#9f7aea22', border: '1px solid #9f7aea44', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShippingIcon sx={{ color: '#9f7aea', fontSize: 16 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Guía de envío</Typography>
                </Box>
                <Typography sx={{ color: '#9f7aea', fontWeight: 700, fontFamily: 'monospace', fontSize: 15, mt: 0.5 }}>
                  {orden.numeroEnvio}
                </Typography>
              </Box>
            )}

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1.5 }} />

            {/* Productos */}
            <Stack spacing={0.75} sx={{ mb: 2 }}>
              {orden.detalles.map((d) => (
                <Box key={d.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                    {d.productoNombre}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                    {d.cantidad} und
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Total pagado</Typography>
              <Typography sx={{ color: GREEN[400], fontWeight: 800, fontSize: 18 }}>
                {formatCurrency(orden.total)}
              </Typography>
            </Box>

            {/* Botón de confirmar */}
            {canReceive && (
              <>
                {!allChecked && (
                  <Alert
                    severity="warning"
                    icon={<WarnIcon sx={{ fontSize: 16 }} />}
                    sx={{ mb: 2, bgcolor: '#2d2000', border: '1px solid #f6ad5533', color: '#f6ad55', borderRadius: 2, fontSize: 12, py: 0.5 }}
                  >
                    Verifica todos los productos antes de confirmar ({checkedCount}/{checklist.length})
                  </Alert>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={loading ? undefined : <ReceiveIcon />}
                  disabled={!allChecked || loading}
                  onClick={() => setConfirmOpen(true)}
                  sx={{
                    py: 1.4,
                    borderRadius: 2,
                    bgcolor: allChecked ? GREEN[500] : `${GREEN[700]}55`,
                    '&:hover': { bgcolor: GREEN[400] },
                    '&:disabled': { bgcolor: `${GREEN[700]}55`, color: 'rgba(255,255,255,0.3)' },
                    fontWeight: 700,
                    fontSize: 15,
                    boxShadow: allChecked ? `0 4px 16px ${GREEN[700]}88` : 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  {loading ? 'Registrando...' : 'Confirmar "Recibí mi pedido"'}
                </Button>
              </>
            )}
          </Paper>

          {/* Info sobre QRs */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${GREEN[700]}33`, bgcolor: '#161b22' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <QrIcon sx={{ color: GREEN[400], fontSize: 18 }} />
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                Registro de envases
              </Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.7 }}>
              Al confirmar, los{' '}
              <strong style={{ color: GREEN[300] }}>
                {checklist.reduce((s, i) => s + i.cantidad, 0)} envases
              </strong>{' '}
              entrarán automáticamente al inventario con estado{' '}
              <strong style={{ color: GREEN[400] }}>Disponible</strong> y sus códigos QR
              individuales generados.
            </Typography>
          </Paper>
        </Stack>
      </Box>

      {/* ── Diálogo de confirmación final ─────────────────────────────────── */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        slotProps={{
          paper: {
            sx: { bgcolor: '#161b22', border: `1px solid ${GREEN[700]}55`, borderRadius: 3, minWidth: 380 }
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
          ¿Confirmar recepción completa?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, mb: 2 }}>
            Estás a punto de confirmar que recibiste correctamente:
          </DialogContentText>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {checklist.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: `${GREEN[700]}22`, border: `1px solid ${GREEN[600]}33` }}>
                <CheckIcon sx={{ color: GREEN[400], fontSize: 18 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                  {item.productoNombre} — <strong style={{ color: GREEN[400] }}>{item.cantidad} unidades</strong>
                </Typography>
              </Box>
            ))}
          </Stack>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            La orden pasará a estado <strong style={{ color: GREEN[400] }}>Completada</strong> y
            los envases ingresarán al inventario. Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<ReceiveIcon />}
            onClick={handleConfirmReceive}
            sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2 }}
          >
            Sí, confirmar recepción
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
