import { Box, Typography, Paper } from '@mui/material';
import { QrCodeScanner as QrIcon } from '@mui/icons-material';

export default function SalidaEnvasePage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
        Registrar Salida de Envase
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 3, fontSize: 14 }}>
        Escanea el QR del envase para registrar el préstamo al cliente
      </Typography>
      <Paper elevation={0} sx={{ p: 5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 3, textAlign: 'center' }}>
        <QrIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.15)', mb: 2 }} />
        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
          El escáner QR se implementará en la Etapa 4 (CU-09)
        </Typography>
      </Paper>
    </Box>
  );
}
