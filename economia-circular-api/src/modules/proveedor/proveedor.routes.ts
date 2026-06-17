import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import * as proveedorController from './proveedor.controller';

const router = Router();

// Públicas o para clientes logueados (Restaurantes)
router.get('/', authenticate, proveedorController.listarProveedores);
router.get('/:id', authenticate, proveedorController.obtenerDetalle);

// Solo Admin o Proveedor
router.post('/perfil', authenticate, authorize(['ADMIN', 'PROVEEDOR']), proveedorController.crearPerfil);

// Solo el proveedor puede subir productos a su catálogo
// upload.single('imagen') procesa el archivo multipart y lo deja en req.file
router.post('/productos', authenticate, authorize(['PROVEEDOR']), upload.single('imagen'), proveedorController.crearProducto);

export default router;
