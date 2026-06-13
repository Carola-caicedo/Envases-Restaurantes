import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

/**
 * Protege rutas según autenticación y rol.
 * - Si no autenticado → redirige a /login
 * - Si autenticado pero sin el rol requerido → redirige a la ruta raíz del rol
 */
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    // Redirige a la home del rol actual
    const roleHome: Record<UserRole, string> = {
      ADMIN: '/admin/dashboard',
      CAJERO: '/cajero/salida',
      OPERARIO: '/operario/devolucion',
      PROVEEDOR: '/proveedor/perfil',
      CLIENTE: '/login',
    };
    return <Navigate to={roleHome[user.rol]} replace />;
  }

  return <Outlet />;
}
