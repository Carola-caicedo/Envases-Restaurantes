import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import QRScanner from '../../components/common/QRScanner';
import {
  buscarEnvase,
  registrarBaja,
  ESTADOS_ENVASE_CONFIG,
} from '../../data/mockEnvases';
import type { Envase, MotivoBaja } from '../../types';
import { toast } from 'react-toastify';
import InfoIcon from '@mui/icons-material/Info';
import QrIcon from '@mui/icons-material/QrCode';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const GREEN = {
  900: '#1a3a2a',
  800: '#1e4d35',
  700: '#246040',
  600: '#2d7a50',
  500: '#38a169',
  400: '#48bb78',
  300: '#68d391',
};

const MOTIVOS_BAJA: { value: MotivoBaja; label: string }[] = [
  { value: 'ROTO', label: 'Rotura / Fisura Física' },
  { value: 'MANCHADO', label: 'Mancha / Decoloración Permanente' },
  { value: 'DESGASTE_NATURAL', label: 'Desgaste por uso natural' },
  { value: 'EXTRAVIADO', label: 'Extraviado / No retornado' },
];

export default function BajaEnvasePage() {
  const [envase, setEnvase] = useState<Envase | null>(null);
  
  // Formulario baja
  const [motivo, setMotivo] = useState<MotivoBaja>('DESGASTE_NATURAL');
  const [observaciones, setObservaciones] = useState('');

  // Proceso
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{ envase: Envase; motivo: MotivoBaja; observaciones: string } | null>(null);

  const handleScanSuccess = (code: string) => {
    const found = buscarEnvase(code);
    if (found) {
      setEnvase(found);
      toast.success(`Envase ${found.idAlfanumerico} detectado`);
    } else {
      toast.error(`Código '${code}' no corresponde a ningún envase registrado`);
    }
  };

  const handleConfirmarBaja = async () => {
    if (!envase) return;
    setConfirmOpen(false);
    setLoading(true);

    try {
      // Simulación de llamada API
      await new Promise((r) => setTimeout(r, 1200));

      const res = registrarBaja(envase.id, motivo, observaciones.trim(), 'ope_001');
      setSuccessData({ envase: res.envase, motivo, observaciones: observaciones.trim() });
      setSuccess(true);
      toast.success('Envase dado de baja exitosamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar la baja');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEnvase(null);
    setMotivo('DESGASTE_NATURAL');
    setObservaciones('');
    setSuccess(false);
    setSuccessData(null);
  };

  const isBajaValida = envase?.estado !== 'FUERA_CIRCULACION';
  const isObsReq = ['ROTO', 'MANCHADO'].includes(motivo);
  const canSubmit = isBajaValida && observaciones.trim().length >= (isObsReq ? 10 : 0);

  if (success && successData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            bgcolor: 'rgba(239,83,80,0.15)',
            border: '2px solid #fc8181',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          <ReportProblemIcon sx={{ fontSize: 48, color: '#fc8181' }} />
        </Box>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
          ¡Envase Dado de Baja!
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
          El envase <strong style={{ color: '#fc8181' }}>{successData.envase.idAlfanumerico}</strong> ha sido retirado de circulación.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1.5px solid rgba(239,83,80,0.3)`,
            bgcolor: '#161b22',
            maxWidth: 420,
            width: '100%',
            mb: 4,
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Detalles del Reporte de Baja
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Envase</Typography>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                {successData.envase.nombreProducto}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Motivo de Baja</Typography>
              <Typography sx={{ color: '#fc8181', fontWeight: 700, fontSize: 13 }}>
                {MOTIVOS_BAJA.find((m) => m.value === successData.motivo)?.label}
              </Typography>
            </Box>
            {successData.observaciones && (
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, mb: 0.5 }}>Observaciones:</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, p: 1.5, borderRadius: 2, bgcolor: '#0d1117', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {successData.observaciones}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        <Button
          variant="contained"
          onClick={handleReset}
          sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2.5, px: 4, py: 1.2, fontWeight: 700 }}
        >
          Registrar otra baja
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Header ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
          ⚠️ Registro de Baja de Envase
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
          Retira permanentemente un envase de la circulación por daño, mancha, desgaste o extravío
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
                Escanear Código QR del Envase a Dar de Baja
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
                border: `1.5px solid ${isBajaValida ? 'rgba(255,255,255,0.08)' : 'rgba(239,83,80,0.3)'}`,
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

              {!isBajaValida && (
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
                  Este envase ya está <strong>Fuera de Circulación</strong> (Dado de Baja). No es necesario realizar otra baja.
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

        {/* ── Columna Derecha: Formulario de Reporte de Baja ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Formulario */}
          {envase && isBajaValida && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1.5px solid rgba(239,83,80,0.25)`,
                bgcolor: '#161b22',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <ReportProblemIcon sx={{ color: '#fc8181', fontSize: 20 }} />
                <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                  Formulario de Baja
                </Typography>
              </Box>

              <TextField
                variant="outlined"
                fullWidth
                select
                label="Motivo de la Baja *"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value as MotivoBaja)}
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#fc8181' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#fc8181' },
                  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.4)' },
                }}
              >
                {MOTIVOS_BAJA.map((m) => (
                  <MenuItem key={m.value} value={m.value} sx={{ color: 'white' }}>
                    {m.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                label={isObsReq ? 'Reporte de daño detallado (Mín. 10 caracteres) *' : 'Observaciones (Opcional)'}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Describe el estado físico del envase, fisuras detectadas, decoloración, o reporte de extravío..."
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#fc8181' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#fc8181' },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={() => setConfirmOpen(true)}
                disabled={!canSubmit || loading}
                sx={{
                  py: 1.3,
                  borderRadius: 2.5,
                  bgcolor: '#e53e3e',
                  '&:hover': { bgcolor: '#c53030' },
                  '&:disabled': { bgcolor: 'rgba(229,62,62,0.2)', color: 'rgba(255,255,255,0.2)' },
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: canSubmit ? '0 4px 16px rgba(229,62,62,0.4)' : 'none',
                }}
              >
                {loading ? 'Procesando...' : 'Dar de Baja Envase'}
              </Button>
            </Paper>
          )}

          {/* Guía General */}
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
                Instrucciones de Baja
              </Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, lineHeight: 1.6 }}>
              1. Escanea el código QR del envase defectuoso o perdido.<br />
              2. Selecciona el motivo exacto del retiro de circulación.<br />
              3. Si el motivo es Roto o Manchado, describe el daño obligatoriamente.<br />
              4. Confirma la baja. Destruye o recicla el envase físico según el material.
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
              sx: { bgcolor: '#161b22', border: '1px solid rgba(239,83,80,0.5)', borderRadius: 3, minWidth: 380 }
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
            ¿Confirmar Baja de Envase?
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
              ¿Estás seguro de que deseas retirar este envase de circulación permanentemente?
            </DialogContentText>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.2)' }}>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                {envase.nombreProducto} ({envase.idAlfanumerico})
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                Motivo: {MOTIVOS_BAJA.find((m) => m.value === motivo)?.label}
              </Typography>
            </Box>
            <DialogContentText sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
              Esta acción no se puede deshacer. El envase ya no podrá ser prestado ni devuelto en el sistema.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmarBaja}
              sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' }, borderRadius: 2 }}
            >
              Sí, retirar envase
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
