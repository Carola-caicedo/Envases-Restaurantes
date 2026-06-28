import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import * as ordenController from './orden.controller';

const router = Router();

router.use(authenticate);

// Rutas del Restaurante (Carrito y Órdenes)
router.get('/carrito', authorize(['ADMIN', 'CAJERO']), ordenController.getCart);
router.post('/carrito', authorize(['ADMIN', 'CAJERO']), ordenController.addToCart);

router.post('/', authorize(['ADMIN']), ordenController.crearOrden);
router.get('/restaurante', authorize(['ADMIN', 'CAJERO']), ordenController.listarOrdenesRestaurante);
router.put('/:id/recibir', authorize(['ADMIN', 'CAJERO']), ordenController.recibirOrden);

// Rutas del Proveedor
router.get('/proveedor', authorize(['PROVEEDOR']), ordenController.listarOrdenesProveedor);
router.put('/:id/despachar', authorize(['PROVEEDOR']), ordenController.despacharOrden);

export default router;
