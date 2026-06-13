import { useState } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, Switch,
  FormControlLabel, Chip, Avatar, Divider, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, Tooltip, Alert, Snackbar, MenuItem, CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
  Inventory2 as CatalogIcon,
  PhotoCamera as PhotoIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  LocalShipping as ShippingIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ProveedorPerfil, ProductoCatalogo, MaterialEnvase } from '../../types';

// ─── Paleta verde ──────────────────────────────────────────────────────────────
const G = {
  900: '#1a3a2a', 800: '#1e4d35', 700: '#246040',
  600: '#2d7a50', 500: '#38a169', 400: '#48bb78', 300: '#68d391',
};

// ─── Materiales ────────────────────────────────────────────────────────────────
const MATERIALES: { value: MaterialEnvase; label: string; color: string }[] = [
  { value: 'VIDRIO',                label: 'Vidrio',                color: '#63b3ed' },
  { value: 'ACERO_INOXIDABLE',      label: 'Acero Inoxidable',      color: '#a0aec0' },
  { value: 'PLASTICO_REUTILIZABLE', label: 'Plástico Reutilizable', color: '#f6ad55' },
  { value: 'BAMBU',                 label: 'Bambú',                 color: '#68d391' },
  { value: 'CERAMICA',              label: 'Cerámica',              color: '#f687b3' },
];

// ─── Datos mock ────────────────────────────────────────────────────────────────
const MOCK_PERFIL: ProveedorPerfil = {
  id: 'prov-001',
  usuarioId: '4',
  nombreEmpresa: 'Juan Envases S.A.',
  descripcion: 'Fabricantes de envases reutilizables de alta calidad para el sector gastronómico. Más de 10 años de experiencia en economía circular.',
  direccion: 'Calle 45 #23-10, Bogotá, Colombia',
  condicionesComerciales: 'Pago a 30 días. Mínimo de orden: 50 unidades. Envío gratis sobre $500.000 COP.',
  catalogoActivo: true,
  createdAt: new Date().toISOString(),
};

const MOCK_PRODUCTOS: ProductoCatalogo[] = [
  { id: 'prod-001', proveedorId: 'prov-001', nombre: 'Tarro Vidrio 350ml', descripcion: 'Tarro de vidrio borosilicato con tapa hermética de silicona', precio: 18500, material: 'VIDRIO', capacidadMl: 350, maxUsosEstimado: 200, imagenUrl: '', activo: true },
  { id: 'prod-002', proveedorId: 'prov-001', nombre: 'Bowl Acero 500ml',   descripcion: 'Bowl de acero inoxidable 304 con tapa ajustable',            precio: 32000, material: 'ACERO_INOXIDABLE', capacidadMl: 500, maxUsosEstimado: 500, imagenUrl: '', activo: true },
  { id: 'prod-003', proveedorId: 'prov-001', nombre: 'Envase Plástico 1L', descripcion: 'Contenedor plástico BPA-free grado alimenticio',             precio: 9800,  material: 'PLASTICO_REUTILIZABLE', capacidadMl: 1000, maxUsosEstimado: 100, imagenUrl: '', activo: false },
];

// ─── Schemas Zod ───────────────────────────────────────────────────────────────
const perfilSchema = z.object({
  nombreEmpresa:          z.string().min(3, 'Mínimo 3 caracteres').max(100),
  descripcion:            z.string().min(10, 'Mínimo 10 caracteres').max(500),
  direccion:              z.string().min(5, 'Ingresa una dirección válida').max(200),
  condicionesComerciales: z.string().min(10, 'Describe tus condiciones').max(1000),
  catalogoActivo:         z.boolean(),
});

const productoSchema = z.object({
  nombre:          z.string().min(3, 'Mínimo 3 caracteres').max(100),
  descripcion:     z.string().min(10, 'Mínimo 10 caracteres').max(300),
  precio:          z.coerce.number().min(1, 'Precio inválido'),
  material:        z.string().min(1, 'Selecciona un material'),
  capacidadMl:     z.coerce.number().min(50, 'Mínimo 50ml').max(5000, 'Máximo 5L'),
  maxUsosEstimado: z.coerce.number().min(10, 'Mínimo 10 usos').max(2000),
  imagenUrl:       z.string().optional(),
  activo:          z.boolean(),
});

type PerfilForm   = z.infer<typeof perfilSchema>;
type ProductoForm = z.infer<typeof productoSchema>;

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getMat = (val: string) => MATERIALES.find((m) => m.value === val);
const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

// ─── Shared styles ─────────────────────────────────────────────────────────────
const cardSx = {
  p: 3,
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 3,
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    bgcolor: 'rgba(255,255,255,0.04)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: G[500] },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
  '& .MuiInputLabel-root.Mui-focused': { color: G[400] },
  '& .MuiFormHelperText-root': { color: '#fc8181' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.4)' },
};

const switchSx = {
  '& .MuiSwitch-switchBase.Mui-checked': { color: G[400] },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: G[600] },
};

// ─── Sub-componentes ───────────────────────────────────────────────────────────
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.7, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7 }}>
        {value}
      </Typography>
    </Box>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function PerfilPage() {
  const [perfil, setPerfil]       = useState<ProveedorPerfil>(MOCK_PERFIL);
  const [productos, setProductos] = useState<ProductoCatalogo[]>(MOCK_PRODUCTOS);
  const [activeTab, setActiveTab] = useState<'empresa' | 'catalogo'>('empresa');
  const [editingPerfil, setEditingPerfil]   = useState(false);
  const [savingPerfil, setSavingPerfil]     = useState(false);
  const [productoModal, setProductoModal]   = useState<{ open: boolean; editing: ProductoCatalogo | null }>({ open: false, editing: null });
  const [savingProducto, setSavingProducto] = useState(false);
  const [deleteConfirm, setDeleteConfirm]   = useState<string | null>(null);
  const [snackbar, setSnackbar]             = useState<{ open: boolean; msg: string }>({ open: false, msg: '' });

  // ── Forms ────────────────────────────────────────────────────────────────────
  const perfilForm = useForm<PerfilForm>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nombreEmpresa: perfil.nombreEmpresa, descripcion: perfil.descripcion, direccion: perfil.direccion, condicionesComerciales: perfil.condicionesComerciales, catalogoActivo: perfil.catalogoActivo },
  });

  const productoForm = useForm<ProductoForm>({
    resolver: zodResolver(productoSchema),
    defaultValues: { nombre: '', descripcion: '', precio: 0, material: '', capacidadMl: 250, maxUsosEstimado: 100, imagenUrl: '', activo: true },
  });

  // ── Handlers perfil ──────────────────────────────────────────────────────────
  const startEdit = () => { perfilForm.reset({ ...perfil }); setEditingPerfil(true); };
  const cancelEdit = () => { perfilForm.reset({ ...perfil }); setEditingPerfil(false); };

  const savePerfil = async (data: PerfilForm) => {
    setSavingPerfil(true);
    await new Promise((r) => setTimeout(r, 800));
    setPerfil((p) => ({ ...p, ...data }));
    setEditingPerfil(false);
    setSavingPerfil(false);
    setSnackbar({ open: true, msg: '✅ Perfil actualizado correctamente' });
  };

  // ── Handlers catálogo ────────────────────────────────────────────────────────
  const openNew = () => {
    productoForm.reset({ nombre: '', descripcion: '', precio: 0, material: '', capacidadMl: 250, maxUsosEstimado: 100, imagenUrl: '', activo: true });
    setProductoModal({ open: false, editing: null });
    // small tick to reset state before opening
    setTimeout(() => setProductoModal({ open: true, editing: null }), 0);
  };

  const openEdit = (p: ProductoCatalogo) => {
    productoForm.reset({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, material: p.material, capacidadMl: p.capacidadMl, maxUsosEstimado: p.maxUsosEstimado, imagenUrl: p.imagenUrl, activo: p.activo });
    setProductoModal({ open: true, editing: p });
  };

  const closeModal = () => { if (!savingProducto) setProductoModal({ open: false, editing: null }); };

  const saveProducto = async (data: ProductoForm) => {
    setSavingProducto(true);
    await new Promise((r) => setTimeout(r, 700));
    if (productoModal.editing) {
      setProductos((prev) => prev.map((p) => p.id === productoModal.editing!.id ? { ...p, ...data, precio: Number(data.precio), capacidadMl: Number(data.capacidadMl), maxUsosEstimado: Number(data.maxUsosEstimado), imagenUrl: data.imagenUrl ?? '' } : p));
      setSnackbar({ open: true, msg: '✅ Producto actualizado' });
    } else {
      setProductos((prev) => [{ id: `prod-${Date.now()}`, proveedorId: perfil.id, ...data, precio: Number(data.precio), capacidadMl: Number(data.capacidadMl), maxUsosEstimado: Number(data.maxUsosEstimado), imagenUrl: data.imagenUrl ?? '' }, ...prev]);
      setSnackbar({ open: true, msg: '✅ Producto creado exitosamente' });
    }
    setSavingProducto(false);
    setProductoModal({ open: false, editing: null });
  };

  const toggleActivo = (id: string) => setProductos((prev) => prev.map((p) => p.id === id ? { ...p, activo: !p.activo } : p));

  const deleteProducto = (id: string) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    setSnackbar({ open: true, msg: '🗑️ Producto eliminado' });
  };

  const activos   = productos.filter((p) => p.activo).length;
  const inactivos = productos.length - activos;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <Box>

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>Mi Perfil de Proveedor</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, mt: 0.5 }}>
            Gestiona la información de tu empresa y catálogo de envases
          </Typography>
        </Box>
        {!editingPerfil && (
          <Button startIcon={<EditIcon />} onClick={startEdit} variant="outlined"
            sx={{ color: G[400], borderColor: `${G[500]}66`, '&:hover': { bgcolor: `${G[500]}18`, borderColor: G[400] }, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
            Editar perfil
          </Button>
        )}
      </Box>

      {/* ── Tab bar manual ─────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 0, mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {([
          { key: 'empresa',  icon: <StoreIcon sx={{ fontSize: 17 }} />,   label: 'Información de empresa' },
          { key: 'catalogo', icon: <CatalogIcon sx={{ fontSize: 17 }} />, label: 'Catálogo de productos', badge: productos.length },
        ] as const).map((t) => (
          <Box
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 2.5, py: 1.5, cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              color: activeTab === t.key ? G[400] : 'rgba(255,255,255,0.45)',
              borderBottom: activeTab === t.key ? `3px solid ${G[500]}` : '3px solid transparent',
              transition: 'all 0.2s',
              '&:hover': { color: activeTab === t.key ? G[400] : 'rgba(255,255,255,0.7)' },
            }}
          >
            {t.icon}
            {t.label}
            {'badge' in t && (
              <Chip label={t.badge} size="small"
                sx={{ height: 18, fontSize: 10, bgcolor: `${G[500]}33`, color: G[400], '& .MuiChip-label': { px: 0.75 } }} />
            )}
          </Box>
        ))}
      </Box>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB — Información de empresa
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'empresa' && (
        <Paper elevation={0} sx={cardSx}>

          {/* Cabecera avatar + nombre + stats */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <Box sx={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
              <Avatar sx={{ width: 88, height: 88, bgcolor: G[600], fontSize: 28, fontWeight: 700, border: `3px solid ${G[400]}`, boxShadow: `0 0 0 4px ${G[900]}` }}>
                {perfil.nombreEmpresa.slice(0, 2).toUpperCase()}
              </Avatar>
              {editingPerfil && (
                <Tooltip title="Cambiar logo">
                  <IconButton size="small"
                    sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: G[500], color: 'white', width: 28, height: 28, '&:hover': { bgcolor: G[400] } }}>
                    <PhotoIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Nombre + badge catálogo */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>{perfil.nombreEmpresa}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                <Chip
                  icon={perfil.catalogoActivo ? <CheckIcon /> : <WarningIcon />}
                  label={perfil.catalogoActivo ? 'Catálogo activo' : 'Catálogo inactivo'}
                  size="small"
                  sx={{
                    bgcolor: perfil.catalogoActivo ? `${G[500]}22` : 'rgba(252,129,74,0.15)',
                    color:   perfil.catalogoActivo ? G[400] : '#f6ad55',
                    border:  `1px solid ${perfil.catalogoActivo ? G[500] + '55' : 'rgba(246,173,85,0.4)'}`,
                    fontWeight: 600, fontSize: 12,
                    '& .MuiChip-icon': { fontSize: 14 },
                  }}
                />
                <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                  Miembro desde {new Date(perfil.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}
                </Typography>
              </Box>
            </Box>

            {/* Stats */}
            {!editingPerfil && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {[
                  { label: 'Productos activos', value: activos,   color: G[400] },
                  { label: 'Inactivos',          value: inactivos, color: '#f6ad55' },
                ].map((s) => (
                  <Paper key={s.label} elevation={0}
                    sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, textAlign: 'center', minWidth: 80 }}>
                    <Typography sx={{ color: s.color, fontWeight: 700, fontSize: 22 }}>{s.value}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{s.label}</Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 3 }} />

          {/* Vista edición */}
          {editingPerfil ? (
            <Box component="form" onSubmit={perfilForm.handleSubmit(savePerfil)}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Controller name="nombreEmpresa" control={perfilForm.control} render={({ field, fieldState }) => (
                    <TextField {...field} fullWidth label="Nombre de empresa *" error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx} />
                  )} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller name="direccion" control={perfilForm.control} render={({ field, fieldState }) => (
                    <TextField {...field} fullWidth label="Dirección *" error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx} />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="descripcion" control={perfilForm.control} render={({ field, fieldState }) => (
                    <TextField {...field} fullWidth multiline rows={3} label="Descripción de la empresa *" error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx} />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="condicionesComerciales" control={perfilForm.control} render={({ field, fieldState }) => (
                    <TextField {...field} fullWidth multiline rows={3}
                      label="Condiciones comerciales *"
                      placeholder="Plazo de pago, mínimo de orden, políticas de devolución..."
                      error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx}
                      InputProps={{ startAdornment: (<InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><ShippingIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} /></InputAdornment>) }}
                    />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="catalogoActivo" control={perfilForm.control} render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} onChange={field.onChange} sx={switchSx} />}
                      label={
                        <Box>
                          <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Catálogo visible para administradores</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Cuando está activo, los admins pueden ver y comprar tus productos</Typography>
                        </Box>
                      }
                      sx={{ alignItems: 'flex-start', mx: 0 }}
                    />
                  )} />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 1.5, mt: 3, justifyContent: 'flex-end' }}>
                <Button startIcon={<CancelIcon />} onClick={cancelEdit} disabled={savingPerfil}
                  sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none', fontWeight: 600 }}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={savingPerfil}
                  startIcon={savingPerfil ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                  sx={{ bgcolor: G[500], '&:hover': { bgcolor: G[600] }, textTransform: 'none', fontWeight: 600, borderRadius: 2, boxShadow: `0 4px 14px ${G[500]}55` }}>
                  {savingPerfil ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </Box>
            </Box>
          ) : (
            /* Vista solo lectura */
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <InfoField label="Dirección" value={perfil.direccion} />
              </Grid>
              <Grid item xs={12}>
                <InfoField label="Descripción" value={perfil.descripcion} />
              </Grid>
              <Grid item xs={12}>
                <InfoField label="Condiciones comerciales" value={perfil.condicionesComerciales} />
              </Grid>
            </Grid>
          )}
        </Paper>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB — Catálogo de productos
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'catalogo' && (
        <Box>
          {/* Alerta catálogo inactivo */}
          {!perfil.catalogoActivo && (
            <Alert severity="warning" icon={<WarningIcon />}
              sx={{ mb: 2, bgcolor: 'rgba(246,173,85,0.1)', border: '1px solid rgba(246,173,85,0.3)', borderRadius: 2, color: '#f6ad55' }}>
              Tu catálogo está <strong>inactivo</strong>. Los administradores no pueden ver tus productos. Actívalo en la pestaña "Información de empresa".
            </Alert>
          )}

          {/* Barra acciones */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={`${activos} activos`}    size="small" sx={{ bgcolor: `${G[500]}22`, color: G[400], fontWeight: 600 }} />
              <Chip label={`${inactivos} inactivos`} size="small" sx={{ bgcolor: 'rgba(246,173,85,0.15)', color: '#f6ad55', fontWeight: 600 }} />
            </Box>
            <Button startIcon={<AddIcon />} variant="contained" onClick={openNew}
              sx={{ bgcolor: G[500], '&:hover': { bgcolor: G[600] }, textTransform: 'none', fontWeight: 600, borderRadius: 2, boxShadow: `0 4px 14px ${G[500]}44` }}>
              Nuevo producto
            </Button>
          </Box>

          {/* Tabla */}
          <Paper elevation={0} sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', borderColor: 'rgba(255,255,255,0.07)', bgcolor: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell>Producto</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell align="right">Capacidad</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="center">Usos est.</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((p) => {
                    const mat = getMat(p.material);
                    return (
                      <TableRow key={p.id}
                        sx={{ opacity: p.activo ? 1 : 0.55, '& td': { borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.85)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }, transition: 'opacity 0.2s' }}>
                        {/* Nombre */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: mat ? `${mat.color}22` : 'rgba(255,255,255,0.08)', fontSize: 13, color: mat?.color ?? 'white' }}>
                              {p.nombre.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 600, fontSize: 13, color: 'white' }}>{p.nombre}</Typography>
                              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', maxWidth: 240 }} noWrap>{p.descripcion}</Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Material */}
                        <TableCell>
                          {mat && (
                            <Chip label={mat.label} size="small"
                              sx={{ bgcolor: `${mat.color}18`, color: mat.color, fontSize: 11, fontWeight: 600, border: `1px solid ${mat.color}33` }} />
                          )}
                        </TableCell>

                        {/* Capacidad */}
                        <TableCell align="right">
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                            {p.capacidadMl >= 1000 ? `${p.capacidadMl / 1000}L` : `${p.capacidadMl}ml`}
                          </Typography>
                        </TableCell>

                        {/* Precio */}
                        <TableCell align="right">
                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: G[400] }}>{formatCOP(p.precio)}</Typography>
                        </TableCell>

                        {/* Usos */}
                        <TableCell align="center">
                          <Typography sx={{ fontSize: 13 }}>{p.maxUsosEstimado}</Typography>
                        </TableCell>

                        {/* Toggle activo */}
                        <TableCell align="center">
                          <Tooltip title={p.activo ? 'Desactivar' : 'Activar'}>
                            <Switch checked={p.activo} onChange={() => toggleActivo(p.id)} size="small" sx={switchSx} />
                          </Tooltip>
                        </TableCell>

                        {/* Acciones */}
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="Editar">
                              <IconButton size="small" onClick={() => openEdit(p)}
                                sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: G[400], bgcolor: `${G[500]}22` } }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton size="small" onClick={() => setDeleteConfirm(p.id)}
                                sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fc8181', bgcolor: 'rgba(252,129,129,0.1)' } }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Estado vacío */}
                  {productos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'rgba(255,255,255,0.3)', borderColor: 'transparent' }}>
                        <CatalogIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                        <Typography>No hay productos en tu catálogo</Typography>
                        <Button startIcon={<AddIcon />} onClick={openNew} sx={{ mt: 1.5, color: G[400], textTransform: 'none' }}>
                          Agrega tu primer producto
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL — Crear / Editar producto
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={productoModal.open} onClose={closeModal} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#131c27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, backgroundImage: 'none' } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          {productoModal.editing ? <EditIcon sx={{ color: G[400] }} /> : <AddIcon sx={{ color: G[400] }} />}
          {productoModal.editing ? 'Editar producto' : 'Nuevo producto'}
        </DialogTitle>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />

        <DialogContent sx={{ pt: 2.5 }}>
          <Box component="form" id="form-producto" onSubmit={productoForm.handleSubmit(saveProducto)}>
            <Grid container spacing={2}>
              {/* Nombre */}
              <Grid item xs={12}>
                <Controller name="nombre" control={productoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Nombre del producto *" error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx} />
                )} />
              </Grid>

              {/* Descripción */}
              <Grid item xs={12}>
                <Controller name="descripcion" control={productoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth multiline rows={2} label="Descripción *" error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx} />
                )} />
              </Grid>

              {/* Material */}
              <Grid item xs={12} sm={6}>
                <Controller name="material" control={productoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth select label="Material *" error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx}>
                    {MATERIALES.map((m) => (
                      <MenuItem key={m.value} value={m.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: m.color, flexShrink: 0 }} />
                          {m.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                )} />
              </Grid>

              {/* Precio */}
              <Grid item xs={12} sm={6}>
                <Controller name="precio" control={productoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="number" label="Precio unitario (COP) *"
                    InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: 'rgba(255,255,255,0.4)' }}>$</InputAdornment> }}
                    error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx} />
                )} />
              </Grid>

              {/* Capacidad */}
              <Grid item xs={12} sm={6}>
                <Controller name="capacidadMl" control={productoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="number" label="Capacidad *"
                    InputProps={{ endAdornment: <InputAdornment position="end" sx={{ color: 'rgba(255,255,255,0.4)' }}>ml</InputAdornment> }}
                    error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx} />
                )} />
              </Grid>

              {/* Usos estimados */}
              <Grid item xs={12} sm={6}>
                <Controller name="maxUsosEstimado" control={productoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="number" label="Usos máx. estimados *"
                    InputProps={{ endAdornment: (<InputAdornment position="end"><Tooltip title="Ciclos de uso antes de dar de baja el envase"><InfoIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', cursor: 'help' }} /></Tooltip></InputAdornment>) }}
                    error={!!fieldState.error} helperText={fieldState.error?.message} sx={fieldSx} />
                )} />
              </Grid>

              {/* URL imagen */}
              <Grid item xs={12}>
                <Controller name="imagenUrl" control={productoForm.control} render={({ field }) => (
                  <TextField {...field} fullWidth label="URL de imagen (opcional)" placeholder="https://..."
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhotoIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.3)' }} /></InputAdornment> }}
                    sx={fieldSx} />
                )} />
              </Grid>

              {/* Toggle activo */}
              <Grid item xs={12}>
                <Controller name="activo" control={productoForm.control} render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} sx={switchSx} />}
                    label={<Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Publicar en catálogo inmediatamente</Typography>}
                  />
                )} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={closeModal} disabled={savingProducto} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button type="submit" form="form-producto" variant="contained" disabled={savingProducto}
            startIcon={savingProducto ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            sx={{ bgcolor: G[500], '&:hover': { bgcolor: G[600] }, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            {savingProducto ? 'Guardando...' : productoModal.editing ? 'Actualizar' : 'Crear producto'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Confirm delete ──────────────────────────────────────────────────── */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs"
        PaperProps={{ sx: { bgcolor: '#131c27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, backgroundImage: 'none' } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>¿Eliminar producto?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Esta acción no se puede deshacer. El producto será eliminado permanentemente del catálogo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Cancelar</Button>
          <Button variant="contained" onClick={() => deleteConfirm && deleteProducto(deleteConfirm)}
            sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' }, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ────────────────────────────────────────────────────────── */}
      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" variant="filled" sx={{ bgcolor: G[700], fontWeight: 600 }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
