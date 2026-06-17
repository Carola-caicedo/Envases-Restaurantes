import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { hashPassword, comparePassword, generateTokens } from '../../utils/auth.util';

export const register = async (data: any) => {
  const exists = await prisma.usuario.findUnique({ where: { email: data.email } });
  if (exists) throw new AppError(400, 'El email ya está registrado');

  const hashed = await hashPassword(data.password);
  
  const user = await prisma.usuario.create({
    data: {
      email: data.email,
      passwordHash: hashed,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      rol: data.rol,
    }
  });

  return { id: user.id, email: user.email, rol: user.rol };
};

export const login = async (email: string, pass: string) => {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user || !user.activo) throw new AppError(401, 'Credenciales inválidas o cuenta inactiva');

  const valid = await comparePassword(pass, user.passwordHash);
  if (!valid) throw new AppError(401, 'Credenciales inválidas');

  const tokens = generateTokens({ userId: user.id, email: user.email, rol: user.rol });
  return { user: { id: user.id, nombre: user.nombre, rol: user.rol }, ...tokens };
};
