import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Crear ADMIN
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@circular.com' },
    update: {},
    create: {
      email: 'admin@circular.com',
      passwordHash,
      nombre: 'Administrador',
      apellido: 'Principal',
      rol: 'ADMIN',
    },
  });

  // 2. Crear Proveedor (Usuario y Perfil)
  const proveedorUser = await prisma.usuario.upsert({
    where: { email: 'proveedor@circular.com' },
    update: {},
    create: {
      email: 'proveedor@circular.com',
      passwordHash,
      nombre: 'Empresa',
      apellido: 'Envases S.A.',
      rol: 'PROVEEDOR',
    },
  });

  await prisma.proveedorPerfil.upsert({
    where: { usuarioId: proveedorUser.id },
    update: {},
    create: {
      usuarioId: proveedorUser.id,
      nit: '900123456-7',
      descripcion: 'Fabricante de envases reutilizables de alta calidad.',
    }
  });

  // 3. Crear Cajero y Restaurante (El Admin es dueño del restaurante por simplicidad de pruebas, o creamos un Cajero que sea dueño)
  // Según el esquema, Restaurante pertenece a un AdministradorId. Vamos a asignárselo al ADMIN
  const restaurante = await prisma.restaurante.upsert({
    where: { id: 'rest-123' },
    update: {},
    create: {
      id: 'rest-123',
      nombre: 'Restaurante El Buen Sabor',
      administradorId: admin.id,
    }
  });

  const cajero = await prisma.usuario.upsert({
    where: { email: 'cajero@circular.com' },
    update: {},
    create: {
      email: 'cajero@circular.com',
      passwordHash,
      nombre: 'Carlos',
      apellido: 'Cajero',
      rol: 'CAJERO',
    },
  });
  
  // Asignarle el restaurante al cajero también para las pruebas (en nuestro app.ts el middleware busca el restaurante del usuario activo. Si el CAJERO se loguea, necesita tener un restaurante asociado. En la lógica actual, el Restaurante tiene administradorId. Vamos a dejar que el Cajero actúe como admin del restaurante para las pruebas).
  await prisma.restaurante.update({
    where: { id: restaurante.id },
    data: { administradorId: cajero.id }
  });

  // 4. Crear Cliente
  const clienteUser = await prisma.usuario.upsert({
    where: { email: 'cliente@circular.com' },
    update: {},
    create: {
      email: 'cliente@circular.com',
      passwordHash,
      nombre: 'Juan',
      apellido: 'Consumidor',
      rol: 'CLIENTE',
    },
  });

  await prisma.cliente.upsert({
    where: { usuarioId: clienteUser.id },
    update: {},
    create: {
      usuarioId: clienteUser.id,
      nombre: 'Juan Consumidor'
    }
  });

  console.log('✅ Base de datos poblada con datos de prueba.');
  console.log('Credenciales:');
  console.log(' - Admin: admin@circular.com / 123456');
  console.log(' - Proveedor: proveedor@circular.com / 123456');
  console.log(' - Cajero (Restaurante): cajero@circular.com / 123456');
  console.log(' - Cliente: cliente@circular.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
