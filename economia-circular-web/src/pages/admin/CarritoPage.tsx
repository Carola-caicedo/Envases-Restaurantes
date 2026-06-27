import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import CheckIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import BackIcon from '@mui/icons-material/ArrowBack';
import BagIcon from '@mui/icons-material/ShoppingBag';
import { toast } from 'react-toastify';
import { useCartStore } from '../../store/cartStore';

// ─── Paleta ────────────────────────────────────────────────────────────────────
const GREEN = {
  900: '#1a3a2a',
  800: '#1e4d35',
  700: '#246040',
  600: '#2d7a50',
  500: '#38a169',
  400: '#48bb78',
  300: '#68d391',
  200: '#9ae6b4',
  100: '#c6f6d5',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

// ─── Material badge ────────────────────────────────────────────────────────────
const MATERIAL_COLORS: Record<string, string> = {
  VIDRIO: '#63b3ed',
  ACERO_INOXIDABLE: '#a0aec0',
  PLASTICO_REUTILIZABLE: '#68d391',
  BAMBU: '#d6a04a',
  CERAMICA: '#e88c96',
};
const MATERIAL_LABELS: Record<string, string> = {
  VIDRIO: 'Vidrio',
  ACERO_INOXIDABLE: 'Acero',
  PLASTICO_REUTILIZABLE: 'Plástico',
  BAMBU: 'Bambú',
  CERAMICA: 'Cerámica',
};

// ─── Componente Carrito vacío ──────────────────────────────────────────────────
function EmptyCart({ onBrowse }: { onBrowse: () => void }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${GREEN[800]}, ${GREEN[900]})`,
          border: `2px dashed ${GREEN[600]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CartIcon sx={{ fontSize: 56, color: GREEN[500], opacity: 0.7 }} />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
          Tu carrito está vacío
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, maxWidth: 320 }}>
          Explora el catálogo de proveedores y agrega envases reutilizables a tu pedido.
        </Typography>
        <Button
          variant="contained"
          startIcon={<StoreIcon />}
          onClick={onBrowse}
          sx={{
            bgcolor: GREEN[500],
            '&:hover': { bgcolor: GREEN[400] },
            px: 3,
            py: 1.2,
            borderRadius: 2,
          }}
        >
          Explorar catálogos
        </Button>
      </Box>
    </Box>
  );
}

// ─── Resumen del pedido ────────────────────────────────────────────────────────
interface OrderSummaryProps {
  subtotal: number;
  totalItems: number;
  proveedorNombre: string | null;
  onConfirm: () => void;
  onClear: () => void;
  loading: boolean;
}

function OrderSummary({ subtotal, totalItems, proveedorNombre, onConfirm, onClear, loading }: OrderSummaryProps) {
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${GREEN[700]}55`,
        background: `linear-gradient(135deg, #161b22 0%, #1a2332 100%)`,
        position: 'sticky',
        top: 80,
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2.5 }}>
        Resumen del pedido
      </Typography>

      {proveedorNombre && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${GREEN[700]}22`,
            border: `1px solid ${GREEN[600]}33`,
            mb: 2.5,
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: GREEN[600], fontSize: 14 }}>
            <StoreIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>Proveedor</Typography>
            <Typography sx={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{proveedorNombre}</Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Subtotal ({totalItems} productos)
          </Typography>
          <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
            {formatCurrency(subtotal)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>IVA (19%)</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            {formatCurrency(iva)}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: `${GREEN[700]}44`, my: 0.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ color: 'white', fontSize: 16, fontWeight: 700 }}>Total</Typography>
          <Typography sx={{ color: GREEN[400], fontSize: 20, fontWeight: 800 }}>
            {formatCurrency(total)}
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={<CheckIcon />}
        onClick={onConfirm}
        disabled={loading || totalItems === 0}
        sx={{
          mt: 3,
          py: 1.4,
          borderRadius: 2,
          bgcolor: GREEN[500],
          '&:hover': { bgcolor: GREEN[400] },
          '&:disabled': { bgcolor: `${GREEN[700]}55`, color: 'rgba(255,255,255,0.3)' },
          fontWeight: 700,
          fontSize: 15,
          boxShadow: `0 4px 16px ${GREEN[700]}88`,
        }}
      >
        {loading ? 'Procesando...' : 'Confirmar Orden'}
      </Button>

      <Button
        fullWidth
        variant="outlined"
        size="small"
        onClick={onClear}
        sx={{
          mt: 1.5,
          borderRadius: 2,
          color: 'rgba(255,255,255,0.4)',
          borderColor: 'rgba(255,255,255,0.1)',
          '&:hover': { borderColor: '#fc818155', color: '#fc8181', bgcolor: '#fc818111' },
          fontSize: 13,
        }}
      >
        Vaciar carrito
      </Button>

      <Alert
        severity="info"
        icon={<WarningIcon sx={{ fontSize: 16 }} />}
        sx={{
          mt: 2,
          bgcolor: '#1a2332',
          border: '1px solid #63b3ed33',
          color: '#63b3ed',
          borderRadius: 2,
          fontSize: 12,
          '& .MuiAlert-icon': { color: '#63b3ed', pt: 0.5 },
        }}
      >
        Al confirmar se generará la orden y se notificará al proveedor.
      </Alert>
    </Paper>
  );
}

// ─── Página principal: CarritoPage ────────────────────────────────────────────
export default function CarritoPage() {
  const navigate = useNavigate();
  const { items, proveedorNombre, removeItem, updateCantidad, clearCart } =
    useCartStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrecio = useCartStore((s) => s.totalPrecio());

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [numeroOrden, setNumeroOrden] = useState('');

  const handleConfirmOrder = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    // Simulación de llamada API
    await new Promise((res) => setTimeout(res, 1800));

    const ordenNum = `ORD-${Date.now().toString().slice(-6)}`;
    setNumeroOrden(ordenNum);
    setLoading(false);
    setSuccessDialogOpen(true);
    clearCart();

    toast.success(`Orden ${ordenNum} creada exitosamente`, { autoClose: 5000 });
  };

  const handleGoToOrders = () => {
    setSuccessDialogOpen(false);
    navigate('/admin/ordenes');
  };

  if (items.length === 0 && !successDialogOpen) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
            🛒 Carrito de compras
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
            Gestiona tus productos seleccionados antes de generar la orden
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${GREEN[700]}33`,
            background: '#161b22',
            overflow: 'hidden',
          }}
        >
          <EmptyCart onBrowse={() => navigate('/admin/proveedores')} />
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              🛒 Carrito de compras
            </Typography>
            <Chip
              label={`${totalItems} producto${totalItems !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                bgcolor: `${GREEN[500]}22`,
                color: GREEN[400],
                border: `1px solid ${GREEN[600]}44`,
                fontWeight: 700,
                fontSize: 12,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Revisa los detalles antes de confirmar tu orden de compra
          </Typography>
        </Box>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/admin/proveedores')}
          variant="outlined"
          size="small"
          sx={{
            color: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(255,255,255,0.15)',
            '&:hover': { borderColor: GREEN[500], color: GREEN[400] },
            borderRadius: 2,
          }}
        >
          Seguir comprando
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 3 }}>
        {/* ── Tabla de productos ────────────────────────────────────────────── */}
        <Box>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${GREEN[700]}33`,
              background: '#161b22',
              overflow: 'hidden',
            }}
          >
            {/* Header de la tabla */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: `1px solid ${GREEN[700]}33`,
                background: `linear-gradient(90deg, ${GREEN[900]}99, #161b22)`,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <BagIcon sx={{ color: GREEN[400], fontSize: 20 }} />
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                Productos seleccionados
              </Typography>
              {proveedorNombre && (
                <Chip
                  icon={<StoreIcon sx={{ fontSize: '14px !important', color: `${GREEN[300]} !important` }} />}
                  label={proveedorNombre}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: `${GREEN[700]}33`,
                    color: GREEN[300],
                    border: `1px solid ${GREEN[600]}44`,
                    fontSize: 11,
                  }}
                />
              )}
            </Box>

            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    '& .MuiTableCell-head': {
                      color: 'rgba(255,255,255,0.45)',
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      borderBottom: `1px solid ${GREEN[700]}33`,
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Material</TableCell>
                  <TableCell align="center">Precio unitario</TableCell>
                  <TableCell align="center" width={160}>Cantidad</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center" width={60}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.producto.id}
                    sx={{
                      '&:hover': { bgcolor: `${GREEN[700]}11` },
                      transition: 'background 0.15s',
                      '& .MuiTableCell-root': {
                        borderBottom: `1px solid ${GREEN[700]}22`,
                        py: 2,
                      },
                    }}
                  >
                    {/* Producto */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={item.producto.imagenUrl}
                          variant="rounded"
                          sx={{
                            width: 52,
                            height: 52,
                            bgcolor: `${GREEN[700]}44`,
                            border: `1px solid ${GREEN[600]}44`,
                            borderRadius: 2,
                            '& img': { objectFit: 'cover' },
                          }}
                        >
                          <BagIcon sx={{ color: GREEN[400], fontSize: 24 }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>
                            {item.producto.nombre}
                          </Typography>
                          <Typography
                            sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, mt: 0.25 }}
                            noWrap
                          >
                            {item.producto.capacidadMl}ml · {item.producto.maxUsosEstimado} usos máx.
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Material */}
                    <TableCell align="center">
                      <Chip
                        label={MATERIAL_LABELS[item.producto.material] ?? item.producto.material}
                        size="small"
                        sx={{
                          bgcolor: `${MATERIAL_COLORS[item.producto.material] ?? '#a0aec0'}22`,
                          color: MATERIAL_COLORS[item.producto.material] ?? '#a0aec0',
                          border: `1px solid ${MATERIAL_COLORS[item.producto.material] ?? '#a0aec0'}44`,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    {/* Precio unitario */}
                    <TableCell align="center">
                      <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
                        {formatCurrency(item.producto.precio)}
                      </Typography>
                    </TableCell>

                    {/* Cantidad */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => updateCantidad(item.producto.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          sx={{
                            color: 'rgba(255,255,255,0.5)',
                            '&:hover': { color: GREEN[400], bgcolor: `${GREEN[600]}22` },
                            '&:disabled': { opacity: 0.3 },
                            width: 28,
                            height: 28,
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>

                        <Box
                          component="input"
                          type="number"
                          value={item.cantidad}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val > 0) updateCantidad(item.producto.id, val);
                          }}
                          min={1}
                          sx={{
                            width: 56,
                            height: 32,
                            textAlign: 'center',
                            bgcolor: `${GREEN[700]}22`,
                            color: 'white',
                            border: `1px solid ${GREEN[600]}55`,
                            borderRadius: 1.5,
                            fontSize: 14,
                            outline: 'none',
                            '&:focus': {
                              borderColor: GREEN[400],
                            },
                            // Ocultar flechitas nativas del input type number
                            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                            MozAppearance: 'textfield',
                          }}
                        />

                        <IconButton
                          size="small"
                          onClick={() => updateCantidad(item.producto.id, item.cantidad + 1)}
                          sx={{
                            color: 'rgba(255,255,255,0.5)',
                            '&:hover': { color: GREEN[400], bgcolor: `${GREEN[600]}22` },
                            width: 28,
                            height: 28,
                          }}
                        >
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>

                    {/* Subtotal */}
                    <TableCell align="right">
                      <Typography sx={{ color: GREEN[400], fontWeight: 700, fontSize: 15 }}>
                        {formatCurrency(item.producto.precio * item.cantidad)}
                      </Typography>
                    </TableCell>

                    {/* Eliminar */}
                    <TableCell align="center">
                      <Tooltip title="Eliminar del carrito">
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.producto.id)}
                          sx={{
                            color: 'rgba(255,255,255,0.3)',
                            '&:hover': { color: '#fc8181', bgcolor: '#fc818122' },
                            borderRadius: 1.5,
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Footer con total de unidades */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: `1px solid ${GREEN[700]}33`,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 3,
                background: `${GREEN[900]}55`,
              }}
            >
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                Total de unidades de envases:
                <Box component="span" sx={{ color: GREEN[400], fontWeight: 700, ml: 1 }}>
                  {items.reduce((s, i) => s + i.cantidad, 0)} unidades
                </Box>
              </Typography>
            </Box>
          </TableContainer>

          {/* Nota informativa */}
          <Alert
            severity="success"
            icon={false}
            sx={{
              mt: 2,
              bgcolor: `${GREEN[700]}22`,
              border: `1px solid ${GREEN[600]}33`,
              borderRadius: 2,
              color: GREEN[300],
              fontSize: 13,
              '& .MuiAlert-message': { display: 'flex', alignItems: 'center', gap: 1 },
            }}
          >
            <CheckIcon sx={{ fontSize: 16, color: GREEN[400] }} />
            Al confirmar la orden, el sistema generará un código QR único por cada unidad de envase y notificará al proveedor.
          </Alert>
        </Box>

        {/* ── Panel lateral: resumen ────────────────────────────────────────── */}
        <OrderSummary
          subtotal={totalPrecio}
          totalItems={items.length}
          proveedorNombre={proveedorNombre}
          onConfirm={() => setConfirmDialogOpen(true)}
          onClear={() => setClearDialogOpen(true)}
          loading={loading}
        />
      </Box>

      {/* ── Diálogo de confirmación de orden ──────────────────────────────── */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#161b22',
              border: `1px solid ${GREEN[700]}55`,
              borderRadius: 3,
              minWidth: 360,
            },
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
          ¿Confirmar orden de compra?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Se generará una orden por{' '}
            <Box component="span" sx={{ color: GREEN[400], fontWeight: 700 }}>
              {formatCurrency(totalPrecio * 1.19)}
            </Box>{' '}
            (IVA incluido) para{' '}
            <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>
              {proveedorNombre}
            </Box>
            . El proveedor recibirá una notificación con los detalles del pedido.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmOrder}
            sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2 }}
          >
            Sí, crear orden
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Diálogo de limpiar carrito ─────────────────────────────────────── */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        slotProps={{
          paper: {
            sx: { bgcolor: '#161b22', border: '1px solid #fc818133', borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>¿Vaciar el carrito?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Se eliminarán todos los productos seleccionados. Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setClearDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              clearCart();
              setClearDialogOpen(false);
              toast.info('Carrito vaciado');
            }}
            sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' }, borderRadius: 2 }}
          >
            Sí, vaciar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Diálogo de éxito ─────────────────────────────────────────────── */}
      <Dialog
        open={successDialogOpen}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#161b22',
              border: `1px solid ${GREEN[600]}55`,
              borderRadius: 3,
              minWidth: 400,
              textAlign: 'center',
            },
          }
        }}
      >
        <DialogContent sx={{ pt: 4, pb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: `${GREEN[500]}22`,
              border: `2px solid ${GREEN[400]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <CheckIcon sx={{ fontSize: 40, color: GREEN[400] }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            ¡Orden creada exitosamente!
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, mb: 2 }}>
            Tu orden de compra ha sido registrada
          </Typography>
          <Chip
            label={numeroOrden}
            sx={{
              bgcolor: `${GREEN[700]}33`,
              color: GREEN[300],
              border: `1px solid ${GREEN[600]}55`,
              fontWeight: 800,
              fontSize: 15,
              px: 1,
              py: 0.5,
              height: 'auto',
            }}
          />
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, mt: 2 }}>
            El proveedor ha sido notificado y tiene 24h para responder.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setSuccessDialogOpen(false)}
            variant="outlined"
            sx={{ borderColor: `${GREEN[600]}55`, color: 'rgba(255,255,255,0.5)' }}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            onClick={handleGoToOrders}
            sx={{ bgcolor: GREEN[500], '&:hover': { bgcolor: GREEN[400] }, borderRadius: 2 }}
          >
            Ver mis órdenes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
