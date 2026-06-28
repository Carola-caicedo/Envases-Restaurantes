import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const DRAWER_WIDTH_OPEN = 260;
const DRAWER_WIDTH_CLOSED = 72;

/**
 * Layout principal con sidebar fijo + header fijo + área de contenido scrollable.
 * El sidebar puede colapsarse sin afectar el header (que se ajusta dinámicamente).
 */
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0d1117' }}>
      {/* Sidebar fijo */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      {/* Área principal */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100vh',
        }}
      >
        {/* Header fijo */}
        <Header sidebarOpen={sidebarOpen} sidebarWidth={sidebarWidth} />

        {/* Spacer para el header */}
        <Toolbar sx={{ minHeight: '64px !important' }} />

        {/* Contenido de la página */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
