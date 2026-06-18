import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

// Layouts Placeholder
const AdminLayout = () => <div>Admin Dashboard (Work in progress)</div>;
const ProveedorLayout = () => <div>Proveedor Dashboard (Work in progress)</div>;
const CajeroLayout = () => <div>Cajero Dashboard (Work in progress)</div>;

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Routes>
              <Route path="proveedores" element={<AdminProveedores />} />
              <Route path="*" element={<AdminLayout />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="/proveedor/*" element={
          <ProtectedRoute allowedRoles={['PROVEEDOR']}>
            <Routes>
              <Route path="/" element={<ProveedorDashboard />} />
              <Route path="pedidos" element={<PedidosEntrantes />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="/cajero/*" element={
          <ProtectedRoute allowedRoles={['CAJERO', 'ADMIN']}>
            <Routes>
              <Route path="proveedores" element={<ExploradorProveedores />} />
              <Route path="proveedores/:id" element={<DetalleProveedor />} />
              <Route path="carrito" element={<CarritoCompras />} />
              <Route path="ordenes" element={<MisOrdenes />} />
              <Route path="escaner" element={<EscanerQR />} />
              <Route path="trazabilidad" element={<HistorialTrazabilidad />} />
              <Route path="*" element={<CajeroLayout />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
