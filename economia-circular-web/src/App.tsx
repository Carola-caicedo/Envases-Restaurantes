import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { useAuthStore } from './store/authStore';

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
            <AdminLayout />
          </ProtectedRoute>
        } />

        <Route path="/proveedor/*" element={
          <ProtectedRoute allowedRoles={['PROVEEDOR']}>
            <ProveedorLayout />
          </ProtectedRoute>
        } />

        <Route path="/cajero/*" element={
          <ProtectedRoute allowedRoles={['CAJERO']}>
            <CajeroLayout />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
