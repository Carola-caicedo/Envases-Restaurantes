import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getProveedores, crearPerfilProveedor } from '../../api/proveedor.api';

const AdminProveedores = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ usuarioId: '', nit: '', direccion: '', descripcion: '' });

  const cargarProveedores = () => {
    getProveedores().then(setProveedores).catch(console.error);
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID Perfil', width: 130 },
    { field: 'usuarioNombre', headerName: 'Proveedor', width: 200, valueGetter: (params, row) => row.Usuario?.nombre },
    { field: 'email', headerName: 'Email', width: 250, valueGetter: (params, row) => row.Usuario?.email },
    { field: 'nit', headerName: 'NIT', width: 150 },
    { field: 'direccion', headerName: 'Dirección', width: 250 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearPerfilProveedor(formData);
      setOpen(false);
      cargarProveedores();
    } catch (err) {
      alert('Error al crear perfil de proveedor');
    }
  };

  return (
    <Box sx={{ p: 4, height: 600, width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Gestión de Proveedores</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Vincular Usuario a Proveedor</Button>
      </Box>

      <DataGrid
        rows={proveedores}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10]}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Crear Perfil de Proveedor</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField fullWidth margin="dense" label="ID del Usuario (debe tener rol PROVEEDOR)" required onChange={(e) => setFormData({...formData, usuarioId: e.target.value})} />
            <TextField fullWidth margin="dense" label="NIT" required onChange={(e) => setFormData({...formData, nit: e.target.value})} />
            <TextField fullWidth margin="dense" label="Dirección" required onChange={(e) => setFormData({...formData, direccion: e.target.value})} />
            <TextField fullWidth margin="dense" label="Descripción / Razón Social" multiline rows={3} required onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Crear</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminProveedores;
