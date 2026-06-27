import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  Notifications as NotifIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

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

interface HeaderProps {
  sidebarOpen: boolean;
  sidebarWidth: number;
}

export default function Header({ sidebarWidth }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: 'rgba(15, 20, 25, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 3 }}>
        {/* ── Título / Breadcrumb ──────────────────────────────────────── */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: 17,
              color: 'white',
              letterSpacing: -0.3,
            }}
          >
            Sistema de Economía Circular
          </Typography>
          {user && (
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}
            >
              Panel — {ROLE_LABELS[user.rol]}
            </Typography>
          )}
        </Box>

        {/* ── Acciones del header ──────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Campana de notificaciones */}
          <Tooltip title="Notificaciones">
            <IconButton
              size="small"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotifIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Avatar / Menú de usuario */}
          {user && (
            <>
              <Tooltip title="Mi cuenta">
                <Box
                  onClick={handleMenuOpen}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    ml: 0.5,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                    transition: 'background 0.2s',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: ROLE_COLORS[user.rol],
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {user.nombre.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
                      {user.nombre}
                    </Typography>
                    <Chip
                      label={ROLE_LABELS[user.rol]}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: 9,
                        bgcolor: `${ROLE_COLORS[user.rol]}22`,
                        color: ROLE_COLORS[user.rol],
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  </Box>
                </Box>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      bgcolor: '#1a2332',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      minWidth: 180,
                    },
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 600 }}>
                    {user.nombre}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                <MenuItem
                  onClick={handleMenuClose}
                  sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, gap: 1.5, py: 1 }}
                >
                  <AccountIcon fontSize="small" /> Mi perfil
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, gap: 1.5, py: 1 }}
                >
                  <SettingsIcon fontSize="small" /> Configuración
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: '#fc8181', fontSize: 13, gap: 1.5, py: 1 }}
                >
                  <LogoutIcon fontSize="small" /> Cerrar sesión
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
