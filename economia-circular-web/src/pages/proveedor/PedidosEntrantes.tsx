import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, Dialog, DialogTitle, DialogContent, Grid, CircularProgress, Divider, Avatar, IconButton } from '@mui/material';
import { getOrdenesProveedor, despacharOrdenAPI } from '../../api/orden.api';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloseIcon from '@mui/icons-material/Close';

const PedidosEntrantes = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [qrList, setQrList] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const cargarOrdenes = () => {
    setLoading(true);
    getOrdenesProveedor()
      .then(setOrdenes)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleDespachar = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await despacharOrdenAPI(id);
      setQrList(res.envases); 
      setOpenModal(true);
      cargarOrdenes();
    } catch (err) {
      console.error(err);
      alert('Error al despachar orden');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusDisplay = (estado: string) => {
    switch(estado) {
      case 'PENDIENTE': return { label: 'Nuevo Pedido', color: 'warning', icon: <AccessTimeFilledIcon /> };
      case 'EN_TRANSITO': return { label: 'En Tránsito (Despachado)', color: 'info', icon: <LocalShippingIcon /> };
      case 'ENTREGADA': return { label: 'Completada', color: 'success', icon: <CheckCircleIcon /> };
      default: return { label: estado, color: 'default', icon: <AssignmentOutlinedIcon /> };
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
      <Box mb={5} textAlign="center">
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ 
          background: 'linear-gradient(90deg, #805ad5 0%, #d6bcfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Gestión de Pedidos
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Revisa las solicitudes de los restaurantes y genera los códigos QR para tus envases.
        </Typography>
      </Box>

      {ordenes.length === 0 ? (
        <Box textAlign="center" py={10} bgcolor="rgba(255,255,255,0.02)" borderRadius={4}>
          <AssignmentOutlinedIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No tienes pedidos pendientes.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {ordenes.map(orden => {
            const status = getStatusDisplay(orden.estado);
            return (
              <Grid item xs={12} key={orden.id}>
                <Card sx={{ 
                  borderRadius: 4,
                  bgcolor: 'rgba(22, 27, 34, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                      
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>ID de Orden</Typography>
                        <Typography variant="h5" fontWeight="bold">#{orden.id.substring(0,8).toUpperCase()}</Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                          Fecha: {new Date(orden.createdAt).toLocaleString()}
                        </Typography>
                        <Chip 
                          icon={status.icon} 
                          label={status.label} 
                          color={status.color as any} 
                          sx={{ mt: 2, fontWeight: 'bold' }} 
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Cliente (Restaurante)</Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          <Avatar sx={{ bgcolor: 'rgba(128, 90, 213, 0.2)', color: '#805ad5', mr: 2 }}>
                            {orden.Restaurante?.nombre?.charAt(0) || 'R'}
                          </Avatar>
                          <Typography variant="body1" fontWeight="bold">
                            {orden.Restaurante?.nombre || 'Restaurante Desconocido'}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary" mb={1}>Resumen de Productos</Typography>
                        <Box sx={{ maxHeight: 100, overflowY: 'auto', pr: 1 }}>
                          {orden.Detalles.map((det: any) => (
                            <Box key={det.id} display="flex" justifyContent="space-between" mb={0.5}>
                              <Typography variant="body2">{det.cantidad}x {det.Producto.nombre}</Typography>
                              <Typography variant="body2" color="text.secondary">${(det.cantidad * det.precioUnitario).toLocaleString()}</Typography>
                            </Box>
                          ))}
                        </Box>
                        <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                        <Typography fontWeight="bold" color="primary.light">Total: ${orden.total.toLocaleString()}</Typography>
                      </Grid>

                      <Grid item xs={12} md={2} display="flex" justifyContent="center">
                        {orden.estado === 'PENDIENTE' && (
                          <Button 
                            variant="contained" 
                            color="secondary" 
                            size="large"
                            disabled={actionLoading === orden.id}
                            onClick={() => handleDespachar(orden.id)}
                            sx={{ 
                              borderRadius: 4, 
                              px: 3, py: 1.5,
                              boxShadow: '0 8px 16px rgba(128, 90, 213, 0.4)',
                              fontWeight: 'bold',
                              width: '100%'
                            }}
                          >
                            {actionLoading === orden.id ? <CircularProgress size={24} color="inherit" /> : 'Despachar y Generar QR'}
                          </Button>
                        )}
                        {orden.estado === 'EN_TRANSITO' && (
                          <Typography variant="body2" color="text.secondary" textAlign="center">
                            Esperando confirmación de entrega por el restaurante.
                          </Typography>
                        )}
                      </Grid>

                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Modal de QRs */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(22, 27, 34, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box display="flex" alignItems="center">
            <QrCode2Icon color="secondary" sx={{ mr: 2, fontSize: 30 }} />
            <Typography variant="h5" fontWeight="bold">Lote de Códigos QR Generados</Typography>
          </Box>
          <IconButton onClick={() => setOpenModal(false)} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Box mb={3} p={2} bgcolor="rgba(128, 90, 213, 0.1)" borderRadius={2} border="1px dashed rgba(128, 90, 213, 0.5)">
            <Typography variant="body1" color="secondary.light">
              ¡Éxito! Imprime estos códigos QR y pégalos en los envases antes de enviarlos al restaurante. 
              Estos códigos son únicos y permitirán la trazabilidad de cada envase en la red.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {qrList.map((qr) => (
              <Grid item xs={6} sm={4} md={3} key={qr.qrCode}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', textAlign: 'center', p: 2, borderRadius: 3 }}>
                  <Box 
                    component="img" 
                    src={qr.qrImageBase64} 
                    alt={`QR ${qr.qrCode}`} 
                    sx={{ width: '100%', maxWidth: 150, height: 'auto', borderRadius: 2, bgcolor: 'white', p: 1 }} 
                  />
                  <Typography variant="caption" display="block" color="text.secondary" mt={2} sx={{ wordBreak: 'break-all' }}>
                    ID: {qr.qrCode.substring(0,12)}...
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PedidosEntrantes;
