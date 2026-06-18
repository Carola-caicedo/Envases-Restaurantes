import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import * as notificacionController from './notificacion.controller';

const router = Router();

router.use(authenticate); // Todas las rutas requieren estar logueado

router.get('/', notificacionController.listarNotificaciones);
router.get('/count', notificacionController.countNoLeidas);
router.put('/leidas/todas', notificacionController.marcarTodasLeidas);
router.put('/:id/leida', notificacionController.marcarLeida);

export default router;
