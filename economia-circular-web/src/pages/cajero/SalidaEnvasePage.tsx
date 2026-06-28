import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Divider,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import QRScanner from '../../components/common/QRScanner';
import {
  buscarEnvase,
  getClientes,
  registrarPrestamo,
  ESTADOS_ENVASE_CONFIG,
  COSTO_DEPOSITO,
} from '../../data/mockEnvases';
import type { Envase, Cliente } from '../../types';
import { toast } from 'react-toastify';
import CheckIcon from '@mui/icons-material/CheckCircle';
import AccountIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import QrIcon from '@mui/icons-material/QrCode';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CloseIcon from '@mui/icons-material/Close';

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

export default function SalidaEnvasePage() {
  const [envase, setEnvase] = useState<Envase | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  
  // Buscar cliente
  const [clienteSearch, setClienteSearch] = useState('');
  const [clienteError, setClienteError] = useState<string | null>(null);

  // Registro de nuevo cliente rápido
  const [nuevoCliOpen, setNuevoCliOpen] = useState(false);
  const [nuevoCliNombre, setNuevoCliNombre] = useState('');
  const [nuevoCliEmail, setNuevoCliEmail] = useState('');
  const [nuevoCliTel, setNuevoCliTel] = useState('');

  // Proceso
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{ envase: Envase; cliente: Cliente } | null>(null);

  const handleScanSuccess = (code: string) => {
    const found = buscarEnvase(code);
    if (found) {
      setEnvase(found);
      toast.success(`Envase ${found.idAlfanumerico} detectado`);
    } else {
      toast.error(`Código '${code}' no corresponde a ningún envase registrado`);
    }
  };

  const handleBuscarCliente = () => {
    setClienteError(null);
    const search = clienteSearch.trim().toLowerCase();
    if (!search) return;

    const clientes = getClientes();
    const found = clientes.find(
      (c) =>
        c.email.toLowerCase() === search ||
        c.telefono === search ||
        c.nombre.toLowerCase().includes(search)
    );

    if (found) {
      setCliente(found);
      toast.success(`Cliente ${found.nombre} asociado`);
    } else {
      setClienteError('Cliente no encontrado. ¿Quieres registrarlo rápidamente?');
    }
  };

  const handleRegistrarClienteRapido = () => {
    if (!nuevoCliNombre.trim() || !nuevoCliEmail.trim() || !nuevoCliTel.trim()) {
      toast.error('Completa todos los campos');
      return;
    }

    const nuevoCliente: Cliente = {
      id: `cli_${Date.now()}`,
      usuarioId: `usr_${Date.now()}`,
      nombre: nuevoCliNombre.trim(),
      email: nuevoCliEmail.trim().toLowerCase(),
      telefono: nuevoCliTel.trim(),
      ecoPuntos: 0,
      depositoAcumulado: 0,
    };

    // Agregar al localStorage para persistencia
    const locales = getClientes();
    localStorage.setItem('ec-demo-clientes', JSON.stringify([...locales, nuevoCliente]));

    setCliente(nuevoCliente);
    setNuevoCliOpen(false);
    setNuevoCliNombre('');
    setNuevoCliEmail('');
    setNuevoCliTel('');
    setClienteSearch(nuevoCliente.email);
    setClienteError(null);
    toast.success('Cliente registrado y asociado con éxito');
  };

  const handleConfirmarPrestamo = async () => {
    if (!envase || !cliente) return;
    setConfirmOpen(false);
    setLoading(true);

    try {
      // Simulación de llamada API
      await new Promise((r) => setTimeout(r, 1200));
      
      const res = registrarPrestamo(envase.id, cliente.id, 'caj_001');
      setSuccessData(res);
      setSuccess(true);
      toast.success('Préstamo registrado exitosamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al procesar préstamo');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEnvase(null);
    setCliente(null);
    setClienteSearch('');
    setClienteError(null);
    setSuccess(false);
    setSuccessData(null);
  };

  if (success && successData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            bgcolor: `${GREEN[500]}22`,
            border: `3px solid ${GREEN[400]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          <CheckIcon sx={{ fontSize: 48, color: GREEN[400] }} />
        </Box>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
          ¡Préstamo Registrado!
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
          El envase <strong style={{ color: GREEN[400] }}>{successData.envase.idAlfanumerico}</strong> ahora está prestado.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1.5px solid ${GREEN[700]}33`,
            bgcolor: '#161b22',
            maxWidth: 420,
            width: '100%',
            mb: 4,
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Resumen de Transacción
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Envase</Typography>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                {successData.envase.nombreProducto} ({successData.envase.capacidadMl}ml)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Cliente</Typography>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{successData.cliente.nombre}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Depósito Retenido</Typography>
              <Typography sx={{ color: GREEN[400], fontWeight: 800, fontSize: 14 }}>
                {formatCurrency(COSTO_DEPOSITO)}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Depósito Acumulado Cliente</Typography>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 13 }}>
                {formatCurrency(successData.cliente.depositoAcumulado)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Button
          variant="contained"
          onClick={handleReset}
          sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2.5, px: 4, py: 1.2, fontWeight: 700 }}
        >
          Registrar otro préstamo
        </Button>
      </Box>
    );
  }

  const isEnvaseValido = envase?.estado === 'DISPONIBLE';

  return (
    <Box>
      {/* ── Header ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
          📤 Registro de Salida de Envase (Préstamo)
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
          Asocia un envase a un cliente para registrar el depósito de garantía
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' }, gap: 3 }}>
        {/* ── Columna Izquierda: Escaneo y Detalles ── */}
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
                Escanear Código QR del Envase
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
                border: `1.5px solid ${isEnvaseValido ? `${GREEN[600]}33` : 'rgba(239,83,80,0.25)'}`,
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

              {!isEnvaseValido && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2.5,
                    bgcolor: 'rgba(239,83,80,0.1)',
                    border: '1px solid rgba(239,83,80,0.2)',
                    color: '#fc8181',
                    borderRadius: 2.5,
                    fontSize: 13,
                  }}
                >
                  El envase está en estado <strong>{ESTADOS_ENVASE_CONFIG[envase.estado].label}</strong>. Solo se pueden prestar envases que estén listos y disponibles.
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
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase' }}>Ciclos de uso</Typography>
                  <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
                    {envase.cantidadUsos} de {envase.maxUsos} usos
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase' }}>Registrado el</Typography>
                  <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
                    {new Date(envase.fechaRegistro).toLocaleDateString('es-CO')}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>

        {/* ── Columna Derecha: Cliente e Info Financiera ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Búsqueda de cliente */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1.5px solid ${cliente ? `${GREEN[600]}33` : 'rgba(255,255,255,0.08)'}`,
              bgcolor: '#161b22',
              opacity: isEnvaseValido ? 1 : 0.45,
              pointerEvents: isEnvaseValido ? 'auto' : 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <PersonSearchIcon sx={{ color: GREEN[400], fontSize: 20 }} />
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                Buscar Cliente
              </Typography>
            </Box>

            {cliente ? (
              // Tarjeta de cliente asociado
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: GREEN[600], width: 36, height: 36 }}>
                      <AccountIcon />
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{cliente.nombre}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{cliente.email}</Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={() => setCliente(null)} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#fc8181' } }}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                  <Box sx={{ flex: 1, p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase' }}>Eco-Puntos</Typography>
                    <Typography sx={{ color: GREEN[400], fontWeight: 800, fontSize: 16 }}>{cliente.ecoPuntos}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase' }}>Depósito actual</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 16 }}>{formatCurrency(cliente.depositoAcumulado)}</Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              // Buscador de cliente
              <Box>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  label="Email, celular o nombre..."
                  value={clienteSearch}
                  onChange={(e) => setClienteSearch(e.target.value)}
                  error={!!clienteError}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            onClick={handleBuscarCliente}
                            sx={{ color: GREEN[400], fontWeight: 700, minWidth: 'auto' }}
                          >
                            Buscar
                          </Button>
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    mb: 1.5,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: GREEN[500] },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: GREEN[400] },
                  }}
                />

                {clienteError && (
                  <Box>
                    <Typography sx={{ color: '#fc8181', fontSize: 12, mb: 1.5 }}>{clienteError}</Typography>
                    <Button
                      fullWidth
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setNuevoCliOpen(true)}
                      variant="outlined"
                      sx={{
                        color: GREEN[400],
                        borderColor: `${GREEN[500]}66`,
                        '&:hover': { bgcolor: `${GREEN[500]}22`, borderColor: GREEN[400] },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: 12,
                      }}
                    >
                      Registrar cliente rápido
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Paper>

          {/* Resumen depósito financiero */}
          {envase && isEnvaseValido && cliente && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${GREEN[700]}55`,
                background: `linear-gradient(135deg, #161b22 0%, #1a2332 100%)`,
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 700, mb: 2, fontSize: 15 }}>
                Resumen de Transacción
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Valor depósito préstamo</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{formatCurrency(COSTO_DEPOSITO)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Depósito acumulado previo</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>{formatCurrency(cliente.depositoAcumulado)}</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 700 }}>Depósito total retenido</Typography>
                  <Typography sx={{ color: GREEN[400], fontSize: 16, fontWeight: 800 }}>
                    {formatCurrency(cliente.depositoAcumulado + COSTO_DEPOSITO)}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={() => setConfirmOpen(true)}
                disabled={loading}
                sx={{
                  py: 1.2,
                  borderRadius: 2.5,
                  bgcolor: GREEN[500],
                  '&:hover': { bgcolor: GREEN[400] },
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: `0 4px 16px ${GREEN[700]}66`,
                }}
              >
                {loading ? 'Registrando...' : 'Confirmar Préstamo'}
              </Button>
            </Paper>
          )}

          {/* Guía Cajero */}
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
                Instrucciones del Cajero
              </Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, lineHeight: 1.6 }}>
              1. Enciende la cámara o escribe el código del envase.<br />
              2. Asocia la cuenta del cliente utilizando su correo o teléfono.<br />
              3. Si es cliente nuevo, regístralo rápidamente.<br />
              4. Cobra el valor de depósito en la caja y confirma el préstamo en el sistema.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* ── Diálogo: Registro rápido de cliente ── */}
      <Dialog
        open={nuevoCliOpen}
        onClose={() => setNuevoCliOpen(false)}
        slotProps={{
          paper: {
            sx: { bgcolor: '#161b22', border: `1px solid ${GREEN[700]}55`, borderRadius: 3, minWidth: 360 }
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
          Registro Rápido de Cliente
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, mb: 1 }}>
            Ingresa los datos para registrar y asociar al cliente de inmediato.
          </DialogContentText>

          <TextField
            variant="outlined"
            fullWidth
            size="small"
            label="Nombre Completo *"
            value={nuevoCliNombre}
            onChange={(e) => setNuevoCliNombre(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: GREEN[500] },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
              '& .MuiInputLabel-root.Mui-focused': { color: GREEN[400] },
            }}
          />

          <TextField
            variant="outlined"
            fullWidth
            size="small"
            label="Correo electrónico *"
            type="email"
            value={nuevoCliEmail}
            onChange={(e) => setNuevoCliEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: GREEN[500] },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
              '& .MuiInputLabel-root.Mui-focused': { color: GREEN[400] },
            }}
          />

          <TextField
            variant="outlined"
            fullWidth
            size="small"
            label="Celular / Teléfono *"
            value={nuevoCliTel}
            onChange={(e) => setNuevoCliTel(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: GREEN[500] },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
              '& .MuiInputLabel-root.Mui-focused': { color: GREEN[400] },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setNuevoCliOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleRegistrarClienteRapido}
            sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Registrar y asociar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Diálogo de confirmación del préstamo ── */}
      {envase && cliente && (
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
            ¿Confirmar Préstamo de Envase?
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
              Confirmas que vas a prestar este envase al cliente:
            </DialogContentText>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${GREEN[700]}11`, border: `1.5px solid ${GREEN[600]}33` }}>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                {envase.nombreProducto} ({envase.idAlfanumerico})
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                Destinatario: {cliente.nombre} · {cliente.email}
              </Typography>
            </Box>
            <DialogContentText sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
              Se retendrá un depósito de <strong>{formatCurrency(COSTO_DEPOSITO)}</strong>. Esta transacción cambiará el estado del envase a <strong>En Uso</strong>.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmarPrestamo}
              sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2 }}
            >
              Sí, confirmar salida
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
