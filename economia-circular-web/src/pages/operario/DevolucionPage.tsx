import { Box, Typography, Paper } from '@mui/material';
import { AssignmentReturn as ReturnIcon } from '@mui/icons-material';

export default function DevolucionPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
        Registrar Devolución
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 3, fontSize: 14 }}>
        Escanea el QR del envase devuelto por el cliente
      </Typography>
      <Paper elevation={0} sx={{ p: 5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 3, textAlign: 'center' }}>
        <ReturnIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.15)', mb: 2 }} />
        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
          La devolución con QR se implementará en la Etapa 4 (CU-10)
        </Typography>
      </Paper>
    </Box>
  );
}
