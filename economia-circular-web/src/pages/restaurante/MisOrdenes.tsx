import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Grid, Button, CircularProgress, Divider, Avatar } from '@mui/material';
import { getOrdenesRestaurante } from '../../api/orden.api';
import { recibirOrdenAPI } from '../../api/orden.api';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const MisOrdenes = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      const data = await getOrdenesRestaurante();
      setOrdenes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const handleRecibir = async (ordenId: string) => {
    try {
      setActionLoading(ordenId);
      await recibirOrdenAPI(ordenId);
      // Actualizar vista
      fetchOrdenes();
      alert('¡Pedido recibido exitosamente! Los envases ahora están DISPONIBLES en tu inventario.');
    } catch (error) {
      console.error(error);
      alert('Error al confirmar recepción.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return { bg: 'rgba(237, 137, 54, 0.2)', color: '#ed8936', icon: <AccessTimeIcon fontSize="small" /> };
      case 'EN_TRANSITO': return { bg: 'rgba(66, 153, 225, 0.2)', color: '#4299e1', icon: <LocalShippingOutlinedIcon fontSize="small" /> };
      case 'ENTREGADA': return { bg: 'rgba(72, 187, 120, 0.2)', color: '#48bb78', icon: <CheckCircleOutlinedIcon fontSize="small" /> };
      default: return { bg: 'rgba(160, 174, 192, 0.2)', color: '#a0aec0', icon: <AccessTimeIcon fontSize="small" /> };
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
      <Box mb={5} textAlign="center">
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ 
          background: 'linear-gradient(90deg, #48bb78 0%, #38b2ac 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Seguimiento de Compras
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Monitorea el estado de tus envases solicitados y confirma su recepción.
        </Typography>
      </Box>
      
      {ordenes.length === 0 ? (
        <Box textAlign="center" py={10} bgcolor="rgba(255,255,255,0.02)" borderRadius={4}>
          <Inventory2OutlinedIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No has realizado ninguna compra de envases aún.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {ordenes.map(orden => {
            const statusTheme = getStatusColor(orden.estado);
            
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
                    <Grid container spacing={4} alignItems="center">
                      
                      {/* Información de la Orden */}
                      <Grid item xs={12} md={4}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: 'rgba(56, 161, 105, 0.2)', color: '#48bb78', mr: 2 }}>
                            <StorefrontIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Proveedor</Typography>
                            <Typography variant="h6" fontWeight="bold">{orden.Proveedor?.Usuario?.nombre || 'Proveedor Desconocido'}</Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                        <Typography variant="body2" color="text.secondary">
                          ID Pedido: <Typography component="span" color="text.primary" fontWeight="bold">#{orden.id.substring(0,8).toUpperCase()}</Typography>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Fecha: <Typography component="span" color="text.primary">{new Date(orden.createdAt).toLocaleDateString()}</Typography>
                        </Typography>
                      </Grid>

                      {/* Detalles y Productos */}
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary" mb={2}>Productos Solicitados</Typography>
                        <Box sx={{ 
                          maxHeight: 120, 
                          overflowY: 'auto',
                          pr: 1,
                          '&::-webkit-scrollbar': { width: '4px' },
                          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px' }
                        }}>
                          {orden.Detalles.map((det: any) => (
                            <Box key={det.id} display="flex" justifyContent="space-between" mb={1} p={1} bgcolor="rgba(255,255,255,0.03)" borderRadius={2}>
                              <Typography variant="body2">{det.cantidad}x {det.Producto.nombre}</Typography>
                              <Typography variant="body2" fontWeight="bold" color="primary.main">
                                ${(det.cantidad * det.precioUnitario).toLocaleString()}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt={2} pt={2} borderTop="1px dashed rgba(255,255,255,0.1)">
                          <Typography fontWeight="bold">Total de la Orden</Typography>
                          <Typography fontWeight="900" color="primary.main" variant="h6">${orden.total.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      {/* Estado y Acciones */}
                      <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems={{ xs: 'flex-start', md: 'flex-end' }} justifyContent="center">
                        <Chip 
                          icon={statusTheme.icon}
                          label={orden.estado} 
                          sx={{ 
                            bgcolor: statusTheme.bg, 
                            color: statusTheme.color,
                            fontWeight: 'bold',
                            px: 1,
                            mb: 3,
                            '& .MuiChip-icon': { color: statusTheme.color }
                          }} 
                        />
                        
                        {orden.estado === 'EN_TRANSITO' && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={actionLoading === orden.id}
                            onClick={() => handleRecibir(orden.id)}
                            sx={{
                              borderRadius: 8,
                              px: 4,
                              boxShadow: '0 8px 16px rgba(56, 161, 105, 0.4)',
                              fontWeight: 'bold'
                            }}
                          >
                            {actionLoading === orden.id ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Recepción'}
                          </Button>
                        )}
                        
                        {orden.estado === 'PENDIENTE' && (
                          <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'left', md: 'right' }}>
                            Esperando a que el proveedor confirme y despache el pedido.
                          </Typography>
                        )}

                        {orden.estado === 'ENTREGADA' && (
                          <Typography variant="body2" color="success.main" textAlign={{ xs: 'left', md: 'right' }} fontWeight="bold">
                            Envases añadidos a tu inventario. Listos para usar.
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
    </Box>
  );
};

export default MisOrdenes;
