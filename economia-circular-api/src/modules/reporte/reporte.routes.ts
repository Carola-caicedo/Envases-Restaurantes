import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import * as reporteController from './reporte.controller';

const router = Router();

router.use(authenticate);

// Solo administradores y cajeros pueden ver el dashboard de su restaurante
router.get('/dashboard', authorize(['ADMIN', 'CAJERO']), reporteController.getRestauranteDashboard);

export default router;
