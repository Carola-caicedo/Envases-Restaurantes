import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './config/prisma';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Verificar conexión a DB
    await prisma.$connect();
    console.log('✅ Base de datos conectada correctamente (SQLite)');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
