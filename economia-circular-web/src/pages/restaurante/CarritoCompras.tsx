import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Divider, IconButton, Grid, Paper, CircularProgress } from '@mui/material';
import { useCartStore } from '../../store/cartStore';
import { crearOrdenAPI, getCartAPI } from '../../api/orden.api';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const CarritoCompras = () => {
  const { items, total, clearCart, setItems } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Sincronizar siempre con el backend al entrar a esta vista
    getCartAPI()
      .then((cartData) => {
        if (cartData && cartData.length > 0) {
          setItems(cartData);
        }
      })
      .catch(console.error);
  }, [setItems]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setLoading(true);
    // Asumiendo un solo proveedor por orden por simplicidad
    const proveedorId = items[0].proveedorId;
    
    try {
      await crearOrdenAPI(proveedorId);
      setSuccess(true);
      clearCart();
      
      // Esperar un momento para mostrar el éxito y redirigir
      setTimeout(() => {
        navigate('/cajero/ordenes');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      alert('Error al crear la orden. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircleOutlinedIcon color="primary" sx={{ fontSize: 100, mb: 3 }} />
        <Typography variant="h3" fontWeight="bold" gutterBottom>¡Orden Confirmada!</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Tu pedido de envases ha sido enviado al proveedor.
        </Typography>
        <Typography variant="body1" color="primary">Redirigiendo a tus órdenes...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate('/cajero/proveedores')} sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="800">
          Mi Carrito
        </Typography>
      </Box>
      
      {items.length === 0 ? (
        <Paper 
          sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 4,
            bgcolor: 'rgba(22, 27, 34, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" fontWeight="600" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Explora nuestro catálogo de proveedores y descubre envases retornables para tu negocio.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/cajero/proveedores')}
            sx={{ borderRadius: 8, px: 4, py: 1.5 }}
          >
            Explorar Proveedores
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" fontWeight="bold" mb={3}>Productos Seleccionados</Typography>
            {items.map((item, index) => (
              <Card 
                key={index} 
                sx={{ 
                  mb: 2, 
                  borderRadius: 3,
                  bgcolor: 'rgba(22, 27, 34, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    border: '1px solid rgba(56, 161, 105, 0.3)',
                  }
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={3} sm={2}>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          paddingTop: '100%', 
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.05)',
                          position: 'relative'
                        }}
                      >
                        {/* Placeholder para la imagen del producto */}
                        <ShoppingBagOutlinedIcon 
                          sx={{ 
                            position: 'absolute', 
                            top: '50%', left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            color: 'rgba(255,255,255,0.2)' 
                          }} 
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={9} sm={7}>
                      <Typography variant="h6" fontWeight="600">{item.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Proveedor ID: {item.proveedorId.substring(0,8)}...
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign={{ xs: 'left', sm: 'center' }}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, py: 1, px: 2, display: 'inline-block' }}>
                        <Typography fontWeight="bold">x{item.cantidad}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={1} textAlign="right">
                      <IconButton color="error" onClick={() => {/* Lógica para remover (simplificado) */}}>
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 4,
                bgcolor: 'rgba(22, 27, 34, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'sticky',
                top: 24
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>Resumen de Compra</Typography>
              
              <Box sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="bold">${total().toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">Impuestos (IVA 19%)</Typography>
                  <Typography fontWeight="bold">${(total() * 0.19).toLocaleString()}</Typography>
                </Box>
                
                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Total Estimado</Typography>
                  <Typography variant="h4" color="primary.main" fontWeight="900">
                    ${(total() * 1.19).toLocaleString()}
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 4, 
                    py: 1.8, 
                    borderRadius: 2,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 16px rgba(56, 161, 105, 0.3)'
                  }} 
                  onClick={handleCheckout}
                >
                  {loading ? <CircularProgress size={26} color="inherit" /> : 'Generar Orden de Compra'}
                </Button>
                
                <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 3 }}>
                  Al confirmar, notificaremos al proveedor para que prepare tu pedido. 
                  Generaremos los códigos QR automáticamente en el despacho.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CarritoCompras;
