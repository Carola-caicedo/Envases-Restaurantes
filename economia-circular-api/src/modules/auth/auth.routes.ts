import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import * as authController from './auth.controller';

const router = Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
});

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    nombre: z.string().min(2),
    apellido: z.string().optional(),
    telefono: z.string().optional(),
    rol: z.enum(['ADMIN', 'CAJERO', 'OPERARIO', 'PROVEEDOR', 'CLIENTE'])
  })
});

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/register', validateRequest(registerSchema), authController.register);
router.get('/me', authenticate, authController.getMe);

export default router;
