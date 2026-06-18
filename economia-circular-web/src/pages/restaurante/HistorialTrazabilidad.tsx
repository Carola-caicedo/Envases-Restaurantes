import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { getHistorialTrazabilidad } from '../../api/trazabilidad.api';

const HistorialTrazabilidad = () => {
  const [historial, setHistorial] = useState<any[]>([]);

  useEffect(() => {
    getHistorialTrazabilidad().then(setHistorial).catch(console.error);
  }, []);

  const getColor = (tipo: string) => {
    switch (tipo) {
      case 'RETORNO': return 'success';
      case 'PRESTAMO': return 'warning';
      case 'LAVADO': return 'info';
      case 'DESCARTE': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Historial de Movimientos</Typography>

      {historial.length === 0 ? (
        <Typography>No hay movimientos registrados.</Typography>
      ) : (
        historial.map((mov) => (
          <Card key={mov.id} sx={{ mb: 2 }}>
            <CardContent display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Chip label={mov.tipoMovimiento} color={getColor(mov.tipoMovimiento) as any} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(mov.fecha).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="h6">
                  Envase: {mov.Envase.Producto.nombre}
                </Typography>
                <Typography variant="body2">
                  QR: {mov.envaseQr.substring(0,8)}...
                </Typography>
                {mov.Cliente && (
                  <Typography variant="body2" color="primary">
                    Cliente: {mov.Cliente.Usuario.nombre} ({mov.Cliente.Usuario.email})
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default HistorialTrazabilidad;
