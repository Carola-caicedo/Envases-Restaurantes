import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent } from '@mui/material';
import { Scanner } from '@yudiel/react-qr-scanner';
import { escanearQrAPI } from '../../api/trazabilidad.api';

const EscanerQR = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [tipoMovimiento, setTipoMovimiento] = useState('RETORNO');
  const [clienteEmail, setClienteEmail] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState('');

  const handleScan = async (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;
      // Extraer el UUID del código si viene como URL (ej: https://.../qr/uuid)
      const parsedQr = code.split('/').pop() || code;
      setQrCode(parsedQr);
    }
  };

  const procesarEscaneo = async () => {
    if (!qrCode) return;
    try {
      setError('');
      const res = await escanearQrAPI({ 
        qrCode, 
        tipoMovimiento, 
        clienteEmail: clienteEmail || undefined 
      });
      setResultado(res);
      setQrCode(null);
      setClienteEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar el QR');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Escáner de Envases
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ width: '100%', maxWidth: 400, margin: '0 auto', borderRadius: 2, overflow: 'hidden' }}>
            <Scanner onScan={handleScan} />
          </Box>
          <Typography align="center" variant="caption" display="block" sx={{ mt: 1 }}>
            Apunta la cámara al código QR del envase
          </Typography>
        </CardContent>
      </Card>

      {qrCode && (
        <Card sx={{ bgcolor: 'info.light', mb: 4 }}>
          <CardContent>
            <Typography variant="h6">QR Detectado: {qrCode.substring(0,8)}...</Typography>
            
            <FormControl fullWidth sx={{ mt: 2, bgcolor: 'white', borderRadius: 1 }}>
              <InputLabel>Acción a realizar</InputLabel>
              <Select
                value={tipoMovimiento}
                label="Acción a realizar"
                onChange={(e) => setTipoMovimiento(e.target.value)}
              >
                <MenuItem value="PRESTAMO">Préstamo a Cliente</MenuItem>
                <MenuItem value="RETORNO">Retorno de Cliente (+10 EcoPuntos)</MenuItem>
                <MenuItem value="LAVADO">Ingreso a Lavado (Interno)</MenuItem>
                <MenuItem value="DESCARTE">Descarte (Fin de vida útil)</MenuItem>
              </Select>
            </FormControl>

            {(tipoMovimiento === 'PRESTAMO' || tipoMovimiento === 'RETORNO') && (
              <TextField 
                fullWidth 
                label="Email del Cliente (Opcional)" 
                variant="outlined" 
                sx={{ mt: 2, bgcolor: 'white', borderRadius: 1 }}
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
              />
            )}

            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              sx={{ mt: 3 }}
              onClick={procesarEscaneo}
            >
              Confirmar Operación
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <Typography color="error" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
          ❌ {error}
        </Typography>
      )}

      {resultado && (
        <Card sx={{ bgcolor: 'success.light', mt: 2 }}>
          <CardContent>
            <Typography variant="h6" color="white" align="center">
              ✅ Operación Exitosa
            </Typography>
            <Typography color="white" align="center">
              Estado Actual: {resultado.envaseEstado}
            </Typography>
            <Typography color="white" align="center">
              Usos: {resultado.usosActuales} / {resultado.maxUsos}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default EscanerQR;
