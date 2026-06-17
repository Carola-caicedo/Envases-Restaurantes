import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/v1/auth', authRoutes);

// Manejo de errores centralizado
app.use(errorMiddleware);

export default app;
