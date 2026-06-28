import { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField, InputAdornment, Alert, IconButton } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import CameraIcon from '@mui/icons-material/Videocam';
import CameraOffIcon from '@mui/icons-material/VideocamOff';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SendIcon from '@mui/icons-material/Send';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  placeholderText?: string;
  loading?: boolean;
}

const GREEN = {
  500: '#38a169',
  400: '#48bb78',
  300: '#68d391',
};

export default function QRScanner({
  onScanSuccess,
  placeholderText = 'Escribe el código del envase...',
  loading = false,
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const scannerId = 'qr-reader-container';

  const stopScanner = async () => {
    if (qrReaderRef.current && qrReaderRef.current.isScanning) {
      try {
        await qrReaderRef.current.stop();
      } catch (err) {
        console.error('Error al apagar la cámara:', err);
      }
    }
    setIsScanning(false);
  };

  const startScanner = async () => {
    setCameraError(null);
    setIsScanning(true);
    
    // Un pequeño delay para asegurar que el div del container está renderizado
    setTimeout(async () => {
      try {
        const html5Qrcode = new Html5Qrcode(scannerId);
        qrReaderRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.7;
              return { width: size, height: size };
            },
          },
          (decodedText) => {
            // Éxito
            onScanSuccess(decodedText);
            stopScanner();
          },
          () => {
            // Error silencioso del scanner (esperando qr)
          }
        );
      } catch (err: any) {
        console.error('Error al inicializar html5-qrcode:', err);
        setCameraError(
          'No se pudo acceder a la cámara. Asegúrate de dar los permisos correspondientes o utiliza la entrada manual.'
        );
        setIsScanning(false);
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (qrReaderRef.current && qrReaderRef.current.isScanning) {
        qrReaderRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* ── Selector de Modo ── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <Button
          variant={isScanning ? 'contained' : 'outlined'}
          onClick={isScanning ? stopScanner : startScanner}
          startIcon={isScanning ? <CameraOffIcon /> : <CameraIcon />}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.2,
            borderRadius: 2.5,
            bgcolor: isScanning ? GREEN[500] : 'transparent',
            borderColor: isScanning ? 'transparent' : 'rgba(56,161,105,0.35)',
            color: isScanning ? 'white' : GREEN[400],
            '&:hover': {
              bgcolor: isScanning ? GREEN[400] : 'rgba(56,161,105,0.1)',
              borderColor: GREEN[400],
            },
            fontWeight: 700,
            textTransform: 'none',
            fontSize: 14,
          }}
        >
          {isScanning ? 'Apagar Cámara' : 'Escanear QR con Cámara'}
        </Button>
      </Box>

      {/* ── Mensaje de error de cámara ── */}
      {cameraError && (
        <Alert
          severity="warning"
          sx={{
            mb: 2.5,
            bgcolor: 'rgba(221,107,32,0.1)',
            border: '1px solid rgba(221,107,32,0.25)',
            color: '#f6ad55',
            borderRadius: 2,
            fontSize: 13,
            '& .MuiAlert-icon': { color: '#f6ad55' },
          }}
        >
          {cameraError}
        </Alert>
      )}

      {/* ── Zona del Scanner de Cámara ── */}
      {isScanning && (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 420,
            mx: 'auto',
            aspectRatio: '1 / 1',
            borderRadius: 4,
            overflow: 'hidden',
            border: `2px solid ${GREEN[500]}`,
            bgcolor: 'black',
            boxShadow: `0 0 20px ${GREEN[500]}44`,
            mb: 3,
          }}
        >
          <Box id={scannerId} sx={{ width: '100%', height: '100%', '& video': { objectFit: 'cover' } }} />

          {/* Overlay de Enfoque */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Esquinas del visor */}
            <Box
              sx={{
                width: '70%',
                height: '70%',
                border: '2px dashed rgba(255,255,255,0.4)',
                borderRadius: 2,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Línea láser animada */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '90%',
                  height: '2px',
                  bgcolor: GREEN[400],
                  boxShadow: `0 0 10px ${GREEN[400]}, 0 0 5px ${GREEN[400]}`,
                  top: '50%',
                  animation: 'laserFloat 2s ease-in-out infinite',
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Estilo para la animación del láser */}
      <style>{`
        @keyframes laserFloat {
          0% { top: 15%; }
          50% { top: 85%; }
          100% { top: 15%; }
        }
      `}</style>

      {/* ── Entrada de código manual ── */}
      {!isScanning && (
        <Box component="form" onSubmit={handleManualSubmit} sx={{ width: '100%' }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder={placeholderText}
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyboardIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      disabled={!manualCode.trim() || loading}
                      sx={{
                        color: GREEN[400],
                        '&:disabled': { color: 'rgba(255,255,255,0.15)' },
                        '&:hover': { bgcolor: `${GREEN[500]}22` },
                      }}
                    >
                      <SendIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.03)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: GREEN[500] },
              },
              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.3)' },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
