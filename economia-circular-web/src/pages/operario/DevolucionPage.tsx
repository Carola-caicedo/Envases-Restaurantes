import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Stack,
} from '@mui/material';
import QRScanner from '../../components/common/QRScanner';
import {
  buscarEnvase,
  registrarDevolucion,
  getTransacciones,
  getClientes,
  ESTADOS_ENVASE_CONFIG,
  COSTO_DEPOSITO,
  ECO_PUNTOS_POR_DEVOLUCION,
} from '../../data/mockEnvases';
import type { Envase, Cliente, TransaccionEnvase } from '../../types';
import { toast } from 'react-toastify';
import CheckIcon from '@mui/icons-material/CheckCircle';
import AccountIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import QrIcon from '@mui/icons-material/QrCode';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import WarningIcon from '@mui/icons-material/Warning';

const GREEN = {
  900: '#1a3a2a',
  800: '#1e4d35',
  700: '#246040',
  600: '#2d7a50',
  500: '#38a169',
  400: '#48bb78',
  300: '#68d391',
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

export default function DevolucionPage() {
  const [envase, setEnvase] = useState<Envase | null>(null);
  const [lastTx, setLastTx] = useState<TransaccionEnvase | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  // Proceso
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{
    envase: Envase;
    cliente: Cliente | null;
    ecoPuntosAsignados: number;
    bajaAutomatica: boolean;
  } | null>(null);

  const handleScanSuccess = (code: string) => {
    const found = buscarEnvase(code);
    if (found) {
      setEnvase(found);

      // Buscar la transacción activa y el cliente
      const txs = getTransacciones();
      const activeTx = txs.find((t) => t.envaseId === found.id && !t.cicloCerrado);
      if (activeTx) {
        setLastTx(activeTx);
        const clis = getClientes();
        const cli = clis.find((c) => c.id === activeTx.clienteId);
        if (cli) setCliente(cli);
      } else {
        setLastTx(null);
        setCliente(null);
      }

      toast.success(`Envase ${found.idAlfanumerico} detectado`);
    } else {
      toast.error(`Código '${code}' no corresponde a ningún envase registrado`);
    }
  };

  const handleConfirmarDevolucion = async () => {
    if (!envase) return;
    setConfirmOpen(false);
    setLoading(true);

    try {
      // Simulación de llamada API
      await new Promise((r) => setTimeout(r, 1200));

      const res = registrarDevolucion(envase.id, 'ope_001');
      setSuccessData(res);
      setSuccess(true);
      toast.success('Devolución registrada exitosamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al procesar devolución');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEnvase(null);
    setLastTx(null);
    setCliente(null);
    setSuccess(false);
    setSuccessData(null);
  };

  const isBajaInminente = envase ? envase.cantidadUsos + 1 >= envase.maxUsos : false;

  if (success && successData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            bgcolor: successData.bajaAutomatica ? 'rgba(239,83,80,0.15)' : `${GREEN[500]}22`,
            border: `3px solid ${successData.bajaAutomatica ? '#fc8181' : GREEN[400]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          {successData.bajaAutomatica ? (
            <WarningIcon sx={{ fontSize: 48, color: '#fc8181' }} />
          ) : (
            <CheckIcon sx={{ fontSize: 48, color: GREEN[400] }} />
          )}
        </Box>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
          {successData.bajaAutomatica ? '¡Baja Automática por Ciclos!' : '¡Devolución Procesada!'}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, textAlign: 'center', maxWidth: 420 }}>
          {successData.bajaAutomatica ? (
            <>
              El envase <strong style={{ color: '#fc8181' }}>{successData.envase.idAlfanumerico}</strong> alcanzó su límite de{' '}
              {successData.envase.maxUsos} usos y se ha dado de baja del inventario para su reciclaje.
            </>
          ) : (
            <>
              El envase <strong style={{ color: GREEN[400] }}>{successData.envase.idAlfanumerico}</strong> ha sido enviado a la zona de{' '}
              <strong>Lavado y Desinfección</strong>.
            </>
          )}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1.5px solid ${successData.bajaAutomatica ? 'rgba(239,83,80,0.3)' : `${GREEN[700]}33`}`,
            bgcolor: '#161b22',
            maxWidth: 420,
            width: '100%',
            mb: 4,
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Resumen de Retorno
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Envase</Typography>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                {successData.envase.nombreProducto}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Usos acumulados</Typography>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                {successData.envase.cantidadUsos} usos de {successData.envase.maxUsos}
              </Typography>
            </Box>
            {successData.cliente && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Cliente</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{successData.cliente.nombre}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Eco-Puntos Otorgados</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ color: '#f6ad55', fontSize: 16 }} />
                    <Typography sx={{ color: GREEN[400], fontWeight: 800, fontSize: 14 }}>
                      +{successData.ecoPuntosAsignados} Pts
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Depósito Liberado</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 13 }}>
                    {formatCurrency(COSTO_DEPOSITO)} (Reembolsado)
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>

        <Button
          variant="contained"
          onClick={handleReset}
          sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2.5, px: 4, py: 1.2, fontWeight: 700 }}
        >
          Registrar otra devolución
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Header ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
          ♻️ Registro de Devolución de Envase
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
          Escanea el código QR para liberar el depósito del cliente y enviar el envase a lavado
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' }, gap: 3 }}>
        {/* ── Columna Izquierda: Visor QR y Detalles ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Tarjeta de Escaneo */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${GREEN[700]}33`,
              bgcolor: '#161b22',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <QrIcon sx={{ color: GREEN[400], fontSize: 20 }} />
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                Escanear Código QR del Envase de Retorno
              </Typography>
            </Box>

            <QRScanner onScanSuccess={handleScanSuccess} loading={loading} />
          </Paper>

          {/* Detalles del envase detectado */}
          {envase && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1.5px solid ${isBajaInminente ? 'rgba(239,83,80,0.3)' : `${GREEN[600]}33`}`,
                bgcolor: '#161b22',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                  Envase: {envase.idAlfanumerico}
                </Typography>
                <Chip
                  label={ESTADOS_ENVASE_CONFIG[envase.estado].label}
                  size="small"
                  sx={{
                    bgcolor: ESTADOS_ENVASE_CONFIG[envase.estado].bg,
                    color: ESTADOS_ENVASE_CONFIG[envase.estado].color,
                    border: `1px solid ${ESTADOS_ENVASE_CONFIG[envase.estado].color}33`,
                    fontWeight: 700,
                  }}
                />
              </Box>

              {envase.estado !== 'EN_USO' && (
                <Alert
                  severity="warning"
                  sx={{
                    mb: 2.5,
                    bgcolor: 'rgba(221,107,32,0.1)',
                    border: '1px solid rgba(221,107,32,0.2)',
                    color: '#f6ad55',
                    borderRadius: 2.5,
                    fontSize: 13,
                  }}
                >
                  El envase figura como <strong>{ESTADOS_ENVASE_CONFIG[envase.estado].label}</strong>. Sin embargo, puedes forzar la devolución si el envase fue devuelto físicamente para corregir el inventario.
                </Alert>
              )}

              {isBajaInminente && (
                <Alert
                  severity="error"
                  icon={<WarningIcon sx={{ color: '#fc8181' }} />}
                  sx={{
                    mb: 2.5,
                    bgcolor: 'rgba(239,83,80,0.1)',
                    border: '1px solid rgba(239,83,80,0.2)',
                    color: '#fc8181',
                    borderRadius: 2.5,
                    fontSize: 13,
                  }}
                >
                  <strong>¡Ciclo de vida completado!</strong> Este envase tiene {envase.cantidadUsos} usos de {envase.maxUsos} máximos. Al registrar la devolución se dará de baja automáticamente.
                </Alert>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase' }}>Nombre del producto</Typography>
                  <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{envase.nombreProducto}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase' }}>Material / Capacidad</Typography>
                  <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
                    {envase.material} — {envase.capacidadMl}ml
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase' }}>Usos registrados</Typography>
                  <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
                    {envase.cantidadUsos} de {envase.maxUsos} usos
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase' }}>Último movimiento</Typography>
                  <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
                    {new Date(envase.ultimoCambioEstado).toLocaleString('es-CO')}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>

        {/* ── Columna Derecha: Cliente e Info Financiera ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Historial de préstamo */}
          {envase && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1.5px solid ${cliente ? `${GREEN[600]}33` : 'rgba(255,255,255,0.08)'}`,
                bgcolor: '#161b22',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <HistoryIcon sx={{ color: GREEN[400], fontSize: 20 }} />
                <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                  Detalles del Préstamo Activo
                </Typography>
              </Box>

              {cliente && lastTx ? (
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: GREEN[600], width: 36, height: 36 }}>
                      <AccountIcon />
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{cliente.nombre}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{cliente.email}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Fecha de salida</Typography>
                    <Typography sx={{ color: 'white', fontSize: 13 }}>
                      {new Date(lastTx.fechaSalida).toLocaleString('es-CO')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Depósito a reembolsar</Typography>
                    <Typography sx={{ color: GREEN[400], fontWeight: 800, fontSize: 15 }}>
                      {formatCurrency(COSTO_DEPOSITO)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Eco-puntos a sumar</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#f6ad55' }}>
                      <StarIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                        +{ECO_PUNTOS_POR_DEVOLUCION} Pts
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              ) : (
                <Box sx={{ py: 2, textAlign: 'center' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                    No hay ningún registro de préstamo activo para este envase.
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, mt: 1 }}>
                    Se procesará como una recepción directa para limpieza.
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          {/* Botón de acción */}
          {envase && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${isBajaInminente ? 'rgba(239,83,80,0.3)' : `${GREEN[700]}55`}`,
                background: `linear-gradient(135deg, #161b22 0%, #1a2332 100%)`,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={() => setConfirmOpen(true)}
                disabled={loading}
                sx={{
                  py: 1.3,
                  borderRadius: 2.5,
                  bgcolor: isBajaInminente ? '#e53e3e' : GREEN[500],
                  '&:hover': { bgcolor: isBajaInminente ? '#c53030' : GREEN[400] },
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: isBajaInminente
                    ? '0 4px 16px rgba(229,62,62,0.4)'
                    : `0 4px 16px ${GREEN[700]}66`,
                }}
              >
                {loading
                  ? 'Registrando...'
                  : isBajaInminente
                  ? 'Registrar Retorno y Dar de Baja'
                  : 'Confirmar Devolución'}
              </Button>
            </Paper>
          )}

          {/* Guía Operario */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: `1px solid ${GREEN[700]}22`,
              bgcolor: '#161b22',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InfoIcon sx={{ color: GREEN[400], fontSize: 16 }} />
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 12 }}>
                Instrucciones de Devolución
              </Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, lineHeight: 1.6 }}>
              1. Escanea el código QR del envase retornado.<br />
              2. Confirma los datos del préstamo activo y el cliente.<br />
              3. Si el envase está al final de su ciclo de vida útil, se dará de baja automáticamente.<br />
              4. Confirma la devolución en el sistema y coloca el envase físico en el contenedor de lavado.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* ── Diálogo de confirmación ── */}
      {envase && (
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          slotProps={{
            paper: {
              sx: { bgcolor: '#161b22', border: `1px solid ${isBajaInminente ? 'rgba(239,83,80,0.5)' : `${GREEN[700]}55`}`, borderRadius: 3, minWidth: 380 }
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
            {isBajaInminente ? '¿Confirmar Retorno y Baja Operativa?' : '¿Confirmar Devolución de Envase?'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
              {isBajaInminente
                ? 'El envase ha completado su vida operativa. Al registrar la devolución se procederá a darlo de BAJA permanentemente:'
                : 'Confirmas que recibiste físicamente el envase para su lavado:'}
            </DialogContentText>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isBajaInminente ? 'rgba(239,83,80,0.1)' : `${GREEN[700]}11`, border: `1.5px solid ${isBajaInminente ? 'rgba(239,83,80,0.2)' : `${GREEN[600]}33`}` }}>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                {envase.nombreProducto} ({envase.idAlfanumerico})
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                Usos actuales: {envase.cantidadUsos} usos de {envase.maxUsos}
              </Typography>
            </Box>
            {cliente && (
              <DialogContentText sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                Se reembolsará el depósito de <strong>{formatCurrency(COSTO_DEPOSITO)}</strong> al cliente <strong>{cliente.nombre}</strong> y se le asignarán <strong>{ECO_PUNTOS_POR_DEVOLUCION} eco-puntos</strong>.
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmarDevolucion}
              sx={{ bgcolor: isBajaInminente ? '#e53e3e' : GREEN[500], '&:hover': { bgcolor: isBajaInminente ? '#c53030' : GREEN[400] }, borderRadius: 2 }}
            >
              Sí, confirmar recepción
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
