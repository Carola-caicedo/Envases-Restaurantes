import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import { crearProducto, getMiCatalogo } from '../../api/proveedor.api';
import ProductCard from '../../components/ProductCard';

const ProveedorDashboard = () => {
  const { user } = useAuthStore();
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    material: '',
    precioUnitario: '',
    maxUsosEstimado: '',
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [productos, setProductos] = useState<any[]>([]);

  const fetchCatalogo = async () => {
    try {
      const data = await getMiCatalogo();
      setProductos(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCatalogo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (imagen) data.append('imagen', imagen);

      await crearProducto(data);
      alert('Producto creado exitosamente');
      setOpenForm(false);
      fetchCatalogo(); // Recargar el catálogo
    } catch (err) {
      alert('Error al crear producto');
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold">Mi Panel de Proveedor</Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>Bienvenido, {user?.nombre}</Typography>

      <Button variant="contained" onClick={() => setOpenForm(true)}>+ Añadir Envase al Catálogo</Button>

      {/* Catálogo del Proveedor */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Tus Envases Activos</Typography>
        {productos.length === 0 ? (
          <Typography color="text.secondary">No tienes productos en tu catálogo.</Typography>
        ) : (
          <Grid container spacing={3}>
            {productos.map(p => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <ProductCard 
                  nombre={p.nombre}
                  material={p.material}
                  precioUnitario={p.precioUnitario}
                  maxUsosEstimado={p.maxUsosEstimado}
                  imagenUrl={p.imagenUrl}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Modal Formulario */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Envase Retornable</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nombre" required onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Material" required onChange={(e) => setFormData({...formData, material: e.target.value})} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Precio Unitario" type="number" required onChange={(e) => setFormData({...formData, precioUnitario: e.target.value})} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Vida útil (usos)" type="number" required onChange={(e) => setFormData({...formData, maxUsosEstimado: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files?.[0] || null)} required />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Guardar Producto</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProveedorDashboard;
