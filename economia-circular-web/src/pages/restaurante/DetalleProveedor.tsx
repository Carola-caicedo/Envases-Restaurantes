import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getProveedorDetalle } from '../../api/proveedor.api';
import ProductCard from '../../components/ProductCard';

const DetalleProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getProveedorDetalle(id).then(setProveedor).catch(console.error);
    }
  }, [id]);

  if (!proveedor) return <Typography p={4}>Cargando...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Volver al Explorador</Button>
      
      <Box sx={{ mb: 4, bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h4" fontWeight="bold">{proveedor.Usuario?.nombre}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {proveedor.descripcion}
        </Typography>
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Catálogo de Envases
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {proveedor.Productos?.length > 0 ? (
          proveedor.Productos.map((prod: any) => (
            <Grid item xs={12} sm={6} md={3} key={prod.id}>
              <ProductCard
                nombre={prod.nombre}
                material={prod.material}
                precioUnitario={prod.precioUnitario}
                maxUsosEstimado={prod.maxUsosEstimado}
                imagenUrl={prod.imagenUrl}
                onAddToCart={() => alert('Fase 3: Añadido al carrito')}
              />
            </Grid>
          ))
        ) : (
          <Typography sx={{ p: 3 }} color="text.secondary">Este proveedor aún no tiene productos.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default DetalleProveedor;
