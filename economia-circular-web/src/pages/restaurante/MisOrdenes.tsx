import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { getOrdenesRestaurante } from '../../api/orden.api';

const MisOrdenes = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);

  useEffect(() => {
    getOrdenesRestaurante().then(setOrdenes).catch(console.error);
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Seguimiento de Compras</Typography>
      
      {ordenes.length === 0 ? (
        <Typography>No has realizado ninguna compra de envases.</Typography>
      ) : (
        ordenes.map(orden => (
          <Card key={orden.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Orden a: {orden.Proveedor?.Usuario?.nombre}</Typography>
                <Chip label={orden.estado} color={orden.estado === 'EN_TRANSITO' ? 'info' : orden.estado === 'PENDIENTE' ? 'warning' : 'success'} />
              </Box>
              <Typography color="text.secondary">ID: #{orden.id.substring(0,8)} | Fecha: {new Date(orden.createdAt).toLocaleDateString()}</Typography>
              
              <Box sx={{ mt: 2 }}>
                <ul>
                  {orden.Detalles.map((det: any) => (
                    <li key={det.id}>{det.cantidad}x {det.Producto.nombre}</li>
                  ))}
                </ul>
              </Box>
              <Typography fontWeight="bold" textAlign="right" color="primary">Total: ${orden.total.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MisOrdenes;
