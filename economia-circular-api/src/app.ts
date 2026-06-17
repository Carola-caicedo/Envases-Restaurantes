import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import proveedorRoutes from './modules/proveedor/proveedor.routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/proveedores', proveedorRoutes);

// Manejo de errores centralizado
app.use(errorMiddleware);

export default app;
