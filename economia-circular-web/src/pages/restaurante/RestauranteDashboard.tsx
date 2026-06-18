import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStatsAPI } from '../../api/reporte.api';

const RestauranteDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getDashboardStatsAPI().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <Typography p={4}>Cargando dashboard...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Panel de Control de Impacto
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Envases en Uso</Typography>
              <Typography variant="h3" fontWeight="bold">{stats.kpis.envasesEnUso}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Retornos Totales</Typography>
              <Typography variant="h3" fontWeight="bold">{stats.kpis.retornosTotales}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Clientes Activos</Typography>
              <Typography variant="h3" fontWeight="bold">{stats.kpis.clientesActivos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">CO2 Ahorrado (kg)</Typography>
              <Typography variant="h3" fontWeight="bold">{stats.kpis.impacto.kgCo2Ahorrado}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Retornos en los últimos 30 días</Typography>
          <Box sx={{ height: 300, width: '100%' }}>
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="retornos" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography align="center" color="text.secondary" sx={{ mt: 10 }}>
                Aún no hay datos suficientes para graficar.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RestauranteDashboard;
