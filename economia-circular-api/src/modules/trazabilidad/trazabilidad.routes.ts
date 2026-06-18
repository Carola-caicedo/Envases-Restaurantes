import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import * as trazabilidadController from './trazabilidad.controller';

const router = Router();

router.use(authenticate);

// Cajeros y Administradores de restaurante pueden registrar retornos/préstamos y ver historial
router.post('/escanear', authorize(['ADMIN', 'CAJERO']), trazabilidadController.escanearQr);
router.get('/historial', authorize(['ADMIN', 'CAJERO']), trazabilidadController.historial);

export default router;
