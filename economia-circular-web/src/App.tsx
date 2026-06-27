import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import CarritoPage from './pages/admin/CarritoPage';
import OrdenesPage from './pages/admin/OrdenesPage';
import RecepcionPedidoPage from './pages/admin/RecepcionPedidoPage';

// Cajero pages
import SalidaEnvasePage from './pages/cajero/SalidaEnvasePage';

// Operario pages
import DevolucionPage from './pages/operario/DevolucionPage';
import BajaEnvasePage from './pages/operario/BajaEnvasePage';

// Proveedor pages
import PerfilPage from './pages/proveedor/PerfilPage';
import PedidosPage from './pages/proveedor/PedidosPage';
import DetallePedidoPage from './pages/proveedor/DetallePedidoPage';

// ─── TanStack Query client ─────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// ─── MUI Theme oscuro con acento verde ────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38a169',
      light: '#48bb78',
      dark: '#2d7a50',
    },
    secondary: {
      main: '#805ad5',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
    text: {
      primary: '#e6edf3',
      secondary: 'rgba(230,237,243,0.6)',
    },
    error: { main: '#fc8181' },
    warning: { main: '#f6ad55' },
    info: { main: '#63b3ed' },
    success: { main: '#68d391' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

// ─── App principal ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas con layout */}
            <Route element={<AppLayout />}>
              {/* ── ADMIN ──────────────────────────────────────────────── */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/admin/carrito" element={<CarritoPage />} />
                <Route path="/admin/ordenes" element={<OrdenesPage />} />
                <Route path="/admin/ordenes/:id/recepcion" element={<RecepcionPedidoPage />} />
                {/* Próximas etapas: */}
                {/* <Route path="/admin/proveedores" element={<ProveedoresPage />} /> */}
                {/* <Route path="/admin/inventario" element={<InventarioPage />} /> */}
                {/* <Route path="/admin/reportes" element={<ReportesPage />} /> */}
                {/* <Route path="/admin/configuracion" element={<ConfiguracionPage />} /> */}
              </Route>

              {/* ── CAJERO ─────────────────────────────────────────────── */}
              <Route element={<ProtectedRoute allowedRoles={['CAJERO']} />}>
                <Route path="/cajero/salida" element={<SalidaEnvasePage />} />
                {/* <Route path="/cajero/scanner" element={<ScannerPage />} /> */}
              </Route>

              {/* ── OPERARIO ───────────────────────────────────────────── */}
              <Route element={<ProtectedRoute allowedRoles={['OPERARIO']} />}>
                <Route path="/operario/devolucion" element={<DevolucionPage />} />
                <Route path="/operario/baja" element={<BajaEnvasePage />} />
              </Route>

              {/* ── PROVEEDOR ──────────────────────────────────────────── */}
              <Route element={<ProtectedRoute allowedRoles={['PROVEEDOR']} />}>
                <Route path="/proveedor/perfil" element={<PerfilPage />} />
                <Route path="/proveedor/pedidos" element={<PedidosPage />} />
                <Route path="/proveedor/pedidos/:id" element={<DetallePedidoPage />} />
              </Route>
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          theme="dark"
          toastStyle={{ background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)' }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
