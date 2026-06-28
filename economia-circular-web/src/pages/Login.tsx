import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Recycling as RecyclingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';

const ROLE_HOME: Record<string, string> = {
  ADMIN: '/admin/proveedores',
  CAJERO: '/cajero',
  OPERARIO: '/operario',
  PROVEEDOR: '/proveedor',
  CLIENTE: '/login',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const { user, accessToken } = response.data.data;
      login(user, accessToken);
      navigate(ROLE_HOME[user.rol] || '/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d1a12 0%, #0d1117 50%, #111827 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {/* Card de login */}
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          bgcolor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #48bb78, #2d7a50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 8px 32px #38a16944',
            }}
          >
            <RecyclingIcon sx={{ color: 'white', fontSize: 36 }} />
          </Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
            Iniciar sesión
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, textAlign: 'center' }}>
            Plataforma de Gestión de Envases Reutilizables
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, bgcolor: '#2d1b1b', color: '#fc8181' }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2, ...darkInputSx }}
        />
        <TextField
          fullWidth
          label="Contraseña"
          type={showPwd ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPwd((v) => !v)} edge="end" size="small" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                  {showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3, ...darkInputSx }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            bgcolor: '#38a169',
            '&:hover': { bgcolor: '#2d7a50' },
            '&:disabled': { bgcolor: '#1a4a2e', color: 'rgba(255,255,255,0.3)' },
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 15,
            textTransform: 'none',
            boxShadow: '0 4px 16px #38a16944',
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Ingresar'}
        </Button>

        {/* Accesos rápidos para demo local */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(56,161,105,0.08)', borderRadius: 2, border: '1px solid rgba(56,161,105,0.2)' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Accesos de prueba (password: 123456)
          </Typography>
          {['admin@circular.com', 'proveedor@circular.com', 'cajero@circular.com'].map((mail) => (
            <Button
              key={mail}
              size="small"
              onClick={() => { setEmail(mail); setPassword('123456'); }}
              sx={{
                mr: 0.5, mb: 0.5, fontSize: 10, textTransform: 'none',
                color: 'rgba(255,255,255,0.6)',
                bgcolor: 'rgba(255,255,255,0.06)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                borderRadius: 1,
                px: 1,
              }}
            >
              {mail.split('@')[0]}
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

// Estilos para inputs en modo oscuro
const darkInputSx = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#38a169' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#48bb78' },
};
