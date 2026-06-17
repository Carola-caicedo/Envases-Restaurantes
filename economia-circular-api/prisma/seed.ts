import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeder...');

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@economiacircular.com' },
    update: {},
    create: {
      email: 'admin@economiacircular.com',
      passwordHash: hashedAdminPassword,
      nombre: 'Admin',
      apellido: 'Principal',
      rol: 'ADMIN',
    },
  });

  const restaurante = await prisma.restaurante.create({
    data: {
      nombre: 'Restaurante Central',
      direccion: 'Av. Principal 123',
      administradorId: admin.id,
    }
  });

  console.log('✅ Base de datos inicializada:');
  console.log(`👤 Admin: ${admin.email}`);
  console.log(`🏢 Restaurante: ${restaurante.nombre}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
