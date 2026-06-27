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
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Stack,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBack';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import QrIcon from '@mui/icons-material/QrCode';
import CopyIcon from '@mui/icons-material/ContentCopy';
import BoxIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import type { EstadoOrden } from '../../types';
import { MOCK_ORDENES, ESTADO_CONFIG, formatCurrency, formatDate } from '../../data/mockOrdenes';

// ─── Paleta ────────────────────────────────────────────────────────────────────
const GREEN = {
  900: '#1a3a2a', 800: '#1e4d35', 700: '#246040',
  600: '#2d7a50', 500: '#38a169', 400: '#48bb78',
  300: '#68d391',
};

// ─── Pasos del flujo del proveedor ────────────────────────────────────────────
const STEPS = ['Pendiente', 'Aceptada', 'En preparación', 'En tránsito', 'Completada'];
const STEP_ESTADOS: EstadoOrden[] = ['PENDIENTE', 'ACEPTADA', 'EN_PREPARACION', 'EN_TRANSITO', 'COMPLETADA'];

// ─── QR Badge mock por unidad ──────────────────────────────────────────────────
function QrBadge({ code }: { code: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        py: 0.4,
        borderRadius: 1,
        bgcolor: '#0d1117',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <QrIcon sx={{ fontSize: 12, color: GREEN[400] }} />
      <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
        {code}
      </Typography>
    </Box>
  );
}

// ─── Sección: Form de número de guía ──────────────────────────────────────────
interface DespachoFormProps {
  currentGuia: string | undefined;
  currentEstado: EstadoOrden;
  onDespachar: (guia: string) => void;
}

function DespachoForm({ currentGuia, currentEstado, onDespachar }: DespachoFormProps) {
  const [guia, setGuia] = useState(currentGuia ?? '');
  const [editing, setEditing] = useState(!currentGuia);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const canDispatch = ['ACEPTADA', 'EN_PREPARACION'].includes(currentEstado);
  const isDispatched = ['EN_TRANSITO', 'COMPLETADA'].includes(currentEstado);

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    onDespachar(guia);
    setLoading(false);
    setEditing(false);
  };

  if (isDispatched) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: '#9f7aea22',
          border: '1px solid #9f7aea55',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShippingIcon sx={{ color: '#9f7aea', fontSize: 22 }} />
            <Typography sx={{ color: '#9f7aea', fontWeight: 700, fontSize: 16 }}>
              Paquete en camino
            </Typography>
          </Box>
          <Chip label="En tránsito" size="small" sx={{ bgcolor: '#9f7aea33', color: '#9f7aea', border: '1px solid #9f7aea55', fontWeight: 700 }} />
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, mb: 1.5 }}>
          Número de guía / tracking registrado:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: '#0d1117',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Typography
            sx={{ color: 'white', fontWeight: 700, fontSize: 18, fontFamily: 'monospace', flex: 1 }}
          >
            {currentGuia}
          </Typography>
          <Tooltip title="Copiar número">
            <IconButton
              size="small"
              onClick={() => { navigator.clipboard.writeText(currentGuia ?? ''); toast.info('Copiado al portapapeles'); }}
              sx={{ color: '#9f7aea', '&:hover': { bgcolor: '#9f7aea22' } }}
            >
              <CopyIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, mt: 1.5 }}>
          El administrador recibirá actualizaciones automáticas del estado del envío.
        </Typography>
      </Box>
    );
  }

  if (!canDispatch) {
    return (
      <Alert severity="info" sx={{ bgcolor: '#1a2332', border: '1px solid #63b3ed33', color: '#63b3ed', borderRadius: 2 }}>
        Esta orden aún no está lista para despacho.
      </Alert>
    );
  }

  return (
    <>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          border: `2px dashed ${GREEN[600]}77`,
          background: `linear-gradient(135deg, ${GREEN[900]}66, #161b22)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <ShippingIcon sx={{ color: GREEN[400], fontSize: 22 }} />
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
            Gestionar despacho
          </Typography>
        </Box>

        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, mb: 2 }}>
          Ingresa el número de guía o tracking de la empresa transportadora. Al confirmar, la orden
          cambiará a estado <strong style={{ color: '#9f7aea' }}>En tránsito</strong> y el
          administrador será notificado automáticamente.
        </Typography>

        <TextField
          variant="outlined"
          id="numero-guia"
          fullWidth
          label="Número de guía / tracking"
          value={guia}
          onChange={(e) => setGuia(e.target.value.toUpperCase())}
          placeholder="Ej: TRK-1234567, GU-890123..."
          disabled={!editing || loading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <ShippingIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: currentGuia && !editing ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setEditing(true)} sx={{ color: GREEN[400] }}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              borderRadius: 2,
              fontFamily: 'monospace',
              '& fieldset': { borderColor: `${GREEN[600]}66` },
              '&:hover fieldset': { borderColor: GREEN[500] },
              '&.Mui-focused fieldset': { borderColor: GREEN[400] },
              '&.Mui-disabled': { opacity: 0.6 },
              bgcolor: '#0d1117',
            },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
            '& .MuiInputLabel-root.Mui-focused': { color: GREEN[400] },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<SendIcon />}
          disabled={!guia.trim() || loading}
          onClick={() => setConfirmOpen(true)}
          sx={{
            py: 1.4,
            borderRadius: 2,
            bgcolor: GREEN[500],
            '&:hover': { bgcolor: GREEN[400] },
            '&:disabled': { bgcolor: `${GREEN[700]}55`, color: 'rgba(255,255,255,0.3)' },
            fontWeight: 700,
            fontSize: 15,
            boxShadow: `0 4px 16px ${GREEN[700]}88`,
          }}
        >
          {loading ? 'Procesando...' : 'Marcar como "En tránsito"'}
        </Button>
      </Box>

      {/* Diálogo de confirmación de despacho */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        slotProps={{
          paper: {
            sx: { bgcolor: '#161b22', border: `1px solid ${GREEN[700]}55`, borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>¿Confirmar despacho?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            La orden pasará a estado <strong style={{ color: '#9f7aea' }}>En tránsito</strong> con
            el número de guía:
          </DialogContentText>
          <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: '#9f7aea22', border: '1px solid #9f7aea55' }}>
            <Typography sx={{ color: '#9f7aea', fontWeight: 800, fontSize: 18, fontFamily: 'monospace', textAlign: 'center' }}>
              {guia}
            </Typography>
          </Box>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, mt: 1.5 }}>
            El administrador del restaurante recibirá una notificación con esta información.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            startIcon={<ShippingIcon />}
            sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2 }}
          >
            Confirmar despacho
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ─── Página principal: DetallePedidoPage ──────────────────────────────────────
export default function DetallePedidoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ordenes, setOrdenes] = useState(MOCK_ORDENES);
  const orden = ordenes.find((o) => o.id === id);

  if (!orden) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>
          Pedido no encontrado
        </Typography>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/proveedor/pedidos')}
          sx={{ mt: 2, color: GREEN[400] }}
        >
          Volver a mis pedidos
        </Button>
      </Box>
    );
  }

  const stepIndex = STEP_ESTADOS.indexOf(orden.estado);
  const activeStep = orden.estado === 'CANCELADA' ? -1 : stepIndex;
  const cfg = ESTADO_CONFIG[orden.estado];

  // Generar IDs alfanuméricos mock para cada unidad de envase
  const generateEnvaseIds = (productoId: string, cantidad: number) =>
    Array.from({ length: Math.min(cantidad, 6) }, (_, i) => {
      const suffix = String(i + 1).padStart(3, '0');
      return `EC-${productoId.toUpperCase().slice(-3)}-${suffix}`;
    });

  const handleDespachar = (guia: string) => {
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, estado: 'EN_TRANSITO' as EstadoOrden, numeroEnvio: guia, updatedAt: new Date().toISOString() }
          : o,
      ),
    );
    toast.success(`Orden marcada como "En tránsito". Guía: ${guia}`);
  };

  return (
    <Box>
      {/* ── Breadcrumb / Back ───────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/proveedor/pedidos')}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: GREEN[400] }, borderRadius: 2 }}
        >
          Mis Pedidos
        </Button>
        <Typography sx={{ color: 'rgba(255,255,255,0.2)' }}>/</Typography>
        <Typography sx={{ color: GREEN[400], fontWeight: 600, fontSize: 14 }}>
          {orden.numeroOrden}
        </Typography>
      </Box>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
            {orden.numeroOrden}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, mt: 0.25 }}>
            Recibida el {formatDate(orden.createdAt)} · Última actualización: {formatDate(orden.updatedAt)}
          </Typography>
        </Box>
        <Chip
          label={cfg.label}
          sx={{ bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`, fontWeight: 700, fontSize: 13, px: 1 }}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' }, gap: 3 }}>
        {/* ── Columna izquierda ─────────────────────────────────────────────── */}
        <Stack spacing={3}>
          {/* Stepper de progreso */}
          {orden.estado !== 'CANCELADA' ? (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${GREEN[700]}33`, bgcolor: '#161b22' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Progreso del pedido
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
                        '& .MuiStepConnector-line': { borderColor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          ) : (
            <Alert severity="error" sx={{ bgcolor: '#2d1b1b', border: '1px solid #fc818133', color: '#fc8181', borderRadius: 3 }}>
              <strong>Pedido cancelado.</strong>{' '}
              {orden.motivoCancelacion && `Motivo: ${orden.motivoCancelacion}`}
            </Alert>
          )}

          {/* Detalle de productos con QR */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${GREEN[700]}33`, bgcolor: '#161b22', overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${GREEN[700]}22`, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: `${GREEN[900]}55` }}>
              <BoxIcon sx={{ color: GREEN[400], fontSize: 20 }} />
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                Productos y unidades de envase
              </Typography>
            </Box>

            <Stack divider={<Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />}>
              {orden.detalles.map((detalle) => {
                const mockIds = generateEnvaseIds(detalle.productoId, detalle.cantidad);
                return (
                  <Box key={detalle.id} sx={{ p: 3 }}>
                    {/* Encabezado del producto */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          variant="rounded"
                          sx={{ width: 40, height: 40, bgcolor: `${GREEN[700]}44`, borderRadius: 2 }}
                        >
                          <BoxIcon sx={{ color: GREEN[400], fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>
                            {detalle.productoNombre}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                            {detalle.cantidad} unidades · {formatCurrency(detalle.precioUnitario)} c/u
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ color: GREEN[400], fontWeight: 700, fontSize: 15 }}>
                        {formatCurrency(detalle.subtotal)}
                      </Typography>
                    </Box>

                    {/* IDs de envases generados */}
                    <Box>
                      <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Códigos QR generados ({mockIds.length} de {detalle.cantidad} mostrados)
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {mockIds.map((code) => (
                          <QrBadge key={code} code={code} />
                        ))}
                        {detalle.cantidad > 6 && (
                          <Box
                            sx={{
                              px: 1,
                              py: 0.4,
                              borderRadius: 1,
                              bgcolor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                              +{detalle.cantidad - 6} más
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Stack>

            {/* Total */}
            <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${GREEN[700]}22`, bgcolor: `${GREEN[900]}55`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Total del pedido</Typography>
              <Typography sx={{ color: GREEN[400], fontWeight: 800, fontSize: 20 }}>
                {formatCurrency(orden.total)}
              </Typography>
            </Box>
          </Paper>
        </Stack>

        {/* ── Columna derecha: Despacho + Info ─────────────────────────────── */}
        <Stack spacing={3}>
          {/* Form de despacho */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${GREEN[700]}33`, bgcolor: '#161b22' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Despacho y envío
            </Typography>
            <DespachoForm
              currentGuia={orden.numeroEnvio}
              currentEstado={orden.estado}
              onDespachar={handleDespachar}
            />
          </Paper>

          {/* Info del restaurante */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${GREEN[700]}33`, bgcolor: '#161b22' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Destinatario
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ bgcolor: GREEN[600], width: 40, height: 40 }}>
                <StoreIcon />
              </Avatar>
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 600 }}>Restaurante EcoBite</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Administrador: Ana García</Typography>
              </Box>
            </Box>
            <Stack spacing={1}>
              {[
                { label: 'Dirección',  value: 'Cra. 7 #45-23, Bogotá D.C.' },
                { label: 'Teléfono',   value: '+57 601 234 5678' },
                { label: 'Email',      value: 'admin@demo.com' },
              ].map((row) => (
                <Box key={row.label} sx={{ display: 'flex', gap: 1 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, minWidth: 70 }}>{row.label}:</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{row.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* CTA: volver */}
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/proveedor/pedidos')}
            variant="outlined"
            sx={{
              borderColor: `${GREEN[600]}55`,
              color: GREEN[400],
              '&:hover': { borderColor: GREEN[400], bgcolor: `${GREEN[600]}11` },
              borderRadius: 2,
            }}
          >
            Volver a mis pedidos
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
