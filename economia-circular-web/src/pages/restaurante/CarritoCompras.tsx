import React from 'react';
import { Box, Typography, Button, Card, CardContent, Divider } from '@mui/material';
import { useCartStore } from '../../store/cartStore';
import { crearOrdenAPI } from '../../api/orden.api';
import { useNavigate } from 'react-router-dom';

const CarritoCompras = () => {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return alert('El carrito está vacío');
    
    // Por simplicidad, tomamos el proveedorId del primer item (asumiendo que se compra a 1 proveedor a la vez)
    const proveedorId = items[0].proveedorId;
    
    try {
      await crearOrdenAPI(proveedorId);
      alert('Orden de compra enviada al proveedor');
      clearCart();
      navigate('/cajero/ordenes');
    } catch (err) {
      console.error(err);
      alert('Error al crear la orden');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Carrito de Compras</Typography>
      
      {items.length === 0 ? (
        <Typography>No hay productos en el carrito.</Typography>
      ) : (
        <Card sx={{ maxWidth: 600, p: 2 }}>
          <CardContent>
            {items.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" mb={2}>
                <Typography>{item.cantidad}x {item.nombre}</Typography>
                <Typography fontWeight="bold">${(item.precioUnitario * item.cantidad).toLocaleString()}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total Estimado:</Typography>
              <Typography variant="h6" color="primary">${total().toLocaleString()}</Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 4 }} 
              onClick={handleCheckout}
            >
              Generar Orden de Compra
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CarritoCompras;
