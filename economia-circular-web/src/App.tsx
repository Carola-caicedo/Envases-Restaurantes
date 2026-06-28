import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Rutas/Páginas
import Login from './pages/Login';
import { useAuthStore } from './store/authStore';
import ExploradorProveedores from './pages/restaurante/ExploradorProveedores';
import DetalleProveedor from './pages/restaurante/DetalleProveedor';
import ProveedorDashboard from './pages/proveedor/ProveedorDashboard';
import AdminProveedores from './pages/admin/AdminProveedores';
import CarritoCompras from './pages/restaurante/CarritoCompras';
import MisOrdenes from './pages/restaurante/MisOrdenes';
import PedidosEntrantes from './pages/proveedor/PedidosEntrantes';
import EscanerQR from './pages/restaurante/EscanerQR';
import HistorialTrazabilidad from './pages/restaurante/HistorialTrazabilidad';
import RestauranteDashboard from './pages/restaurante/RestauranteDashboard';

// Layout
import AppLayout from './components/layout/AppLayout';

// Layouts Placeholder para las rutas que aún no existen en nuestra rama actual pero sí en el Sidebar
const CajeroLayout = () => <div>Cajero Dashboard (Work in progress)</div>;
const AdminDashboardPlaceholder = () => <div>Dashboard Global de Admin (Work in progress)</div>;

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<AppLayout />}>
            {/* ADMIN */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboardPlaceholder />} />
                  <Route path="proveedores" element={<AdminProveedores />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* PROVEEDOR */}
            <Route path="/proveedor/*" element={
              <ProtectedRoute allowedRoles={['PROVEEDOR']}>
                <Routes>
                  <Route path="perfil" element={<ProveedorDashboard />} />
                  <Route path="pedidos" element={<PedidosEntrantes />} />
                  <Route path="" element={<Navigate to="perfil" replace />} />
                  <Route path="*" element={<Navigate to="perfil" replace />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* CAJERO */}
            <Route path="/cajero/*" element={
              <ProtectedRoute allowedRoles={['CAJERO', 'ADMIN']}>
                <Routes>
                  <Route path="salida" element={<EscanerQR />} />
                  <Route path="proveedores" element={<ExploradorProveedores />} />
                  <Route path="proveedores/:id" element={<DetalleProveedor />} />
                  <Route path="carrito" element={<CarritoCompras />} />
                  <Route path="ordenes" element={<MisOrdenes />} />
                  <Route path="trazabilidad" element={<HistorialTrazabilidad />} />
                  <Route path="" element={<RestauranteDashboard />} />
                </Routes>
              </ProtectedRoute>
            } />

          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
