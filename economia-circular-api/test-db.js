const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.usuario.findUnique({ where: { email: 'admin@circular.com' } });
  console.log(user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
