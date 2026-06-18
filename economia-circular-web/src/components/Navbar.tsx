import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Box, Button, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../store/authStore';
import { useNotificacionStore } from '../store/notificacionStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { notificaciones, noLeidasCount, fetchNotificaciones, marcarLeida, marcarTodas } = useNotificacionStore();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotificaciones();
      // Polling cada 30 segundos (En prod se usaría WebSockets)
      const interval = setInterval(() => {
        fetchNotificaciones();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotificaciones]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate(`/${user?.rol.toLowerCase()}`)}>
          ♻️ Economía Circular
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">
            Hola, {user?.nombre}
          </Typography>

          <IconButton color="inherit" onClick={handleOpenMenu}>
            <Badge badgeContent={noLeidasCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{ style: { maxHeight: 400, width: 350 } }}
          >
            <Box display="flex" justifyContent="space-between" px={2} py={1} alignItems="center">
              <Typography fontWeight="bold">Notificaciones</Typography>
              {noLeidasCount > 0 && (
                <Button size="small" onClick={() => marcarTodas()}>Marcar leídas</Button>
              )}
            </Box>
            <Divider />
            
            {notificaciones.length === 0 ? (
              <MenuItem disabled>No tienes notificaciones</MenuItem>
            ) : (
              notificaciones.map((notif) => (
                <MenuItem 
                  key={notif.id} 
                  onClick={() => {
                    if (!notif.leida) marcarLeida(notif.id);
                  }}
                  sx={{ 
                    bgcolor: notif.leida ? 'transparent' : 'action.hover',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 1.5
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={notif.leida ? 'normal' : 'bold'}>
                    {notif.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ width: '100%' }}>
                    {notif.mensaje}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </Typography>
                </MenuItem>
              ))
            )}
          </Menu>

          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
