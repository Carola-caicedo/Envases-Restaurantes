import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { getOrdenesProveedor, despacharOrdenAPI } from '../../api/orden.api';

const PedidosEntrantes = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [qrList, setQrList] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const cargarOrdenes = () => {
    getOrdenesProveedor().then(setOrdenes).catch(console.error);
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleDespachar = async (id: string) => {
    try {
      const res = await despacharOrdenAPI(id);
      alert('Orden despachada y QRs generados exitosamente');
      setQrList(res.envases); // Muestra los QRs generados para imprimir
      setOpenModal(true);
      cargarOrdenes();
    } catch (err) {
      console.error(err);
      alert('Error al despachar orden');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Pedidos Entrantes</Typography>

      {ordenes.map(orden => (
        <Card key={orden.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Orden #{orden.id.substring(0,8)}</Typography>
              <Chip label={orden.estado} color={orden.estado === 'PENDIENTE' ? 'warning' : 'success'} />
            </Box>
            <Typography color="text.secondary">Fecha: {new Date(orden.createdAt).toLocaleDateString()}</Typography>
            <Typography fontWeight="bold" sx={{ mt: 1 }}>Total: ${orden.total.toLocaleString()}</Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Detalles:</Typography>
              <ul>
                {orden.Detalles.map((det: any) => (
                  <li key={det.id}>{det.cantidad}x {det.Producto.nombre}</li>
                ))}
              </ul>
            </Box>

            {orden.estado === 'PENDIENTE' && (
              <Button variant="contained" color="primary" onClick={() => handleDespachar(orden.id)} sx={{ mt: 2 }}>
                Aceptar y Generar QRs (Despachar)
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Códigos QR Generados (Listos para imprimir en envases)</DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {qrList.map((qr) => (
              <Box key={qr.qrCode} textAlign="center" border={1} p={1} borderRadius={1} borderColor="grey.300">
                <img src={qr.qrImageBase64} alt={`QR ${qr.qrCode}`} width={150} height={150} />
                <Typography variant="caption" display="block">{qr.qrCode.substring(0,8)}</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PedidosEntrantes;
