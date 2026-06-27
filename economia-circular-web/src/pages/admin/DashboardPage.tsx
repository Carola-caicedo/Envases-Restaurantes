import { Box, Typography, Paper } from '@mui/material';
import {
  Inventory as InventoryIcon,
  Recycling as RecyclingIcon,
  TrendingUp as TrendingUpIcon,
  AssignmentReturn as ReturnIcon,
} from '@mui/icons-material';

const stats = [
  { label: 'Envases Disponibles', value: '—', icon: <InventoryIcon />, color: '#38a169' },
  { label: 'En Circulación', value: '—', icon: <RecyclingIcon />, color: '#3182ce' },
  { label: 'Tasa de Retorno', value: '—', icon: <TrendingUpIcon />, color: '#805ad5' },
  { label: 'Devoluciones Hoy', value: '—', icon: <ReturnIcon />, color: '#dd6b20' },
];

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
        Dashboard
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 3, fontSize: 14 }}>
        Resumen operativo en tiempo real
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
          gap: 2,
        }}
      >
        {stats.map((s) => (
          <Paper
            key={s.label}
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: `${s.color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: s.color,
              }}
            >
              {s.icon}
            </Box>
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                {s.label}
              </Typography>
              <Typography sx={{ color: 'white', fontSize: 24, fontWeight: 700 }}>
                {s.value}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: 3, p: 4,
          bgcolor: 'rgba(255,255,255,0.04)',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
          📊 Los gráficos de inventario y tasa de retorno se implementarán en la Etapa 6
        </Typography>
      </Paper>
    </Box>
  );
}
