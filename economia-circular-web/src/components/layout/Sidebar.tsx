import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Collapse,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  ShoppingCart as CartIcon,
  Inventory as InventoryIcon,
  QrCodeScanner as QrScannerIcon,
  AssignmentReturn as ReturnIcon,
  DeleteSweep as BajaIcon,
  BarChart as ReportsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  ListAlt as OrdersIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
  Recycling as RecyclingIcon,
  ExpandLess,
  ExpandMore,
  Notifications as NotifIcon,
} from '@mui/icons-material';
import type { UserRole } from '../../types';
import { useAuthStore } from '../../store/authStore';

// ─── Paleta de color verde principal ──────────────────────────────────────────
const GREEN = {
  900: '#1a3a2a',
  800: '#1e4d35',
  700: '#246040',
  600: '#2d7a50',
  500: '#38a169',
  400: '#48bb78',
  300: '#68d391',
  100: '#c6f6d5',
  50: '#f0fff4',
};

// ─── Ancho del sidebar ─────────────────────────────────────────────────────────
const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 72;

// ─── Definición de rutas por rol ───────────────────────────────────────────────
interface NavItemDef {
  label: string;
  path?: string;
  icon: React.ReactNode;
  roles: UserRole[];
  children?: NavItemDef[];
}

const NAV_ITEMS: NavItemDef[] = [
  // ── ADMIN
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon />,
    roles: ['ADMIN'],
  },
  {
    label: 'Proveedores',
    icon: <StoreIcon />,
    roles: ['ADMIN'],
    children: [
      { label: 'Explorar catálogos', path: '/admin/proveedores', icon: <StoreIcon />, roles: ['ADMIN'] },
      { label: 'Carrito de compra', path: '/admin/carrito', icon: <CartIcon />, roles: ['ADMIN'] },
      { label: 'Órdenes', path: '/admin/ordenes', icon: <OrdersIcon />, roles: ['ADMIN'] },
    ],
  },
  {
    label: 'Inventario',
    path: '/admin/inventario',
    icon: <InventoryIcon />,
    roles: ['ADMIN'],
  },
  {
    label: 'Reportes',
    path: '/admin/reportes',
    icon: <ReportsIcon />,
    roles: ['ADMIN'],
  },
  {
    label: 'Configuración',
    path: '/admin/configuracion',
    icon: <SettingsIcon />,
    roles: ['ADMIN'],
  },

  // ── CAJERO
  {
    label: 'Registrar Salida',
    path: '/cajero/salida',
    icon: <QrScannerIcon />,
    roles: ['CAJERO'],
  },

  // ── OPERARIO
  {
    label: 'Registrar Devolución',
    path: '/operario/devolucion',
    icon: <ReturnIcon />,
    roles: ['OPERARIO'],
  },
  {
    label: 'Dar de Baja',
    path: '/operario/baja',
    icon: <BajaIcon />,
    roles: ['OPERARIO'],
  },

  // ── PROVEEDOR
  {
    label: 'Mi Perfil',
    path: '/proveedor/perfil',
    icon: <PersonIcon />,
    roles: ['PROVEEDOR'],
  },
  {
    label: 'Mis Pedidos',
    path: '/proveedor/pedidos',
    icon: <OrdersIcon />,
    roles: ['PROVEEDOR'],
  },

  // ── COMPARTIDOS
  {
    label: 'Notificaciones',
    path: '/notificaciones',
    icon: <NotifIcon />,
    roles: ['ADMIN', 'CAJERO', 'OPERARIO', 'PROVEEDOR'],
  },
];

// ─── Labels de rol legibles ────────────────────────────────────────────────────
const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  CAJERO: 'Cajero',
  OPERARIO: 'Operario',
  PROVEEDOR: 'Proveedor',
  CLIENTE: 'Cliente',
};

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: '#38a169',
  CAJERO: '#3182ce',
  OPERARIO: '#dd6b20',
  PROVEEDOR: '#805ad5',
  CLIENTE: '#e53e3e',
};

// ─── Componente principal ──────────────────────────────────────────────────────
interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const drawerWidth = open ? DRAWER_WIDTH : DRAWER_COLLAPSED;

  const filteredItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.rol),
  );

  const isActive = (path?: string) =>
    path ? location.pathname.startsWith(path) : false;

  const isGroupActive = (item: NavItemDef) =>
    item.children?.some((child) => isActive(child.path)) ?? false;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleGroupToggle = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavItem = (item: NavItemDef, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = hasChildren ? isGroupActive(item) : isActive(item.path);
    const expanded = expandedItems.includes(item.label);

    if (hasChildren) {
      return (
        <Box key={item.label}>
          <Tooltip title={!open ? item.label : ''} placement="right">
            <ListItemButton
              onClick={() => handleGroupToggle(item.label)}
              sx={{
                mx: 1,
                my: 0.25,
                borderRadius: 2,
                pl: depth > 0 ? 4 : 1.5,
                color: active ? GREEN[100] : 'rgba(255,255,255,0.75)',
                bgcolor: active ? `${GREEN[600]}88` : 'transparent',
                '&:hover': {
                  bgcolor: `${GREEN[600]}55`,
                  color: 'white',
                },
                transition: 'all 0.2s ease',
                justifyContent: open ? 'flex-start' : 'center',
                minHeight: 44,
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: open ? 36 : 'auto',
                  '& svg': { fontSize: 22 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }}
                  />
                  {expanded ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                </>
              )}
            </ListItemButton>
          </Tooltip>

          {open && (
            <Collapse in={expanded} timeout="auto">
              <List disablePadding>
                {item.children!.filter((c) => user && c.roles.includes(user.rol)).map((child) =>
                  renderNavItem(child, depth + 1),
                )}
              </List>
            </Collapse>
          )}
        </Box>
      );
    }

    return (
      <Tooltip key={item.label} title={!open ? item.label : ''} placement="right">
        <ListItemButton
          onClick={() => item.path && handleNavigate(item.path)}
          sx={{
            mx: 1,
            my: 0.25,
            borderRadius: 2,
            pl: depth > 0 ? 4 : 1.5,
            color: active ? 'white' : 'rgba(255,255,255,0.75)',
            bgcolor: active ? GREEN[500] : 'transparent',
            boxShadow: active ? `0 2px 8px ${GREEN[700]}99` : 'none',
            '&:hover': {
              bgcolor: active ? GREEN[500] : `${GREEN[600]}55`,
              color: 'white',
            },
            transition: 'all 0.2s ease',
            justifyContent: open ? 'flex-start' : 'center',
            minHeight: 44,
          }}
        >
          <ListItemIcon
            sx={{
              color: 'inherit',
              minWidth: open ? 36 : 'auto',
              '& svg': { fontSize: 22 },
            }}
          >
            {item.icon}
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          overflowX: 'hidden',
          background: `linear-gradient(180deg, ${GREEN[900]} 0%, ${GREEN[800]} 60%, ${GREEN[900]} 100%)`,
          borderRight: 'none',
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
    >
      {/* ── Logo / Marca ──────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: open ? 2 : 0,
          py: 2.5,
          justifyContent: open ? 'flex-start' : 'center',
          borderBottom: `1px solid ${GREEN[700]}55`,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${GREEN[400]}, ${GREEN[600]})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${GREEN[700]}88`,
          }}
        >
          <RecyclingIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        {open && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'white', fontWeight: 700, lineHeight: 1.2, fontSize: 13 }}
            >
              Economía Circular
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: GREEN[300], fontSize: 10, letterSpacing: 0.5 }}
            >
              Gestión de Envases
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Perfil de usuario ─────────────────────────────────────────── */}
      {user && (
        <Box
          sx={{
            px: open ? 2 : 0,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            justifyContent: open ? 'flex-start' : 'center',
            borderBottom: `1px solid ${GREEN[700]}55`,
            mx: 1,
            my: 0.5,
            borderRadius: 2,
            bgcolor: `${GREEN[700]}33`,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: ROLE_COLORS[user.rol],
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user.nombre.charAt(0).toUpperCase()}
          </Avatar>
          {open && (
            <Box sx={{ overflow: 'hidden', flex: 1 }}>
              <Typography
                sx={{ color: 'white', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}
                noWrap
              >
                {user.nombre}
              </Typography>
              <Chip
                label={ROLE_LABELS[user.rol]}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  bgcolor: `${ROLE_COLORS[user.rol]}33`,
                  color: ROLE_COLORS[user.rol],
                  border: `1px solid ${ROLE_COLORS[user.rol]}55`,
                  fontWeight: 600,
                  mt: 0.25,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* ── Navegación ────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        <List disablePadding>
          {filteredItems.map((item) => renderNavItem(item))}
        </List>
      </Box>

      <Divider sx={{ borderColor: `${GREEN[700]}55` }} />

      {/* ── Footer: toggle + logout ───────────────────────────────────── */}
      <Box sx={{ p: 1, display: 'flex', flexDirection: open ? 'row' : 'column', gap: 0.5, justifyContent: 'space-between' }}>
        <Tooltip title={open ? 'Cerrar sesión' : 'Cerrar sesión'} placement="right">
          <IconButton
            onClick={handleLogout}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              '&:hover': { color: '#fc8181', bgcolor: '#fc818122' },
              borderRadius: 2,
              p: 1,
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={open ? 'Colapsar menú' : 'Expandir menú'} placement="right">
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              '&:hover': { color: 'white', bgcolor: `${GREEN[600]}55` },
              borderRadius: 2,
              p: 1,
            }}
          >
            {open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
