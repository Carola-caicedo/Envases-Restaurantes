import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getProveedores } from '../../api/proveedor.api';

const ExploradorProveedores = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProveedores().then(setProveedores).catch(console.error);
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Catálogo de Proveedores Ecológicos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Encuentra envases retornables para tu restaurante.
      </Typography>

      <Grid container spacing={3}>
        {proveedores.map((prov) => (
          <Grid item xs={12} md={4} key={prov.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" fontWeight="bold">
                    {prov.Usuario?.nombre}
                  </Typography>
                  <Chip label="Verificado" color="success" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  📍 {prov.direccion || 'Sin dirección registrada'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
                  {prov.descripcion || 'Proveedor de envases sostenibles.'}
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate(`/cajero/proveedores/${prov.id}`)}
                >
                  Ver Catálogo
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExploradorProveedores;
