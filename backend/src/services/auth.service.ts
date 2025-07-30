import { prisma } from "@/config/database";
import { hashPassword, verifyPassword } from "@/utils/password.util";
import { generateTokenPair, verifyToken } from "@/utils/jwt.util";
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "@/types/auth.types";
import { AppError } from "@/middleware/error.middleware";

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Email já está em uso", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
      tokens,
    };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    if (!user.isActive) {
      throw new AppError("Conta desativada", 401);
    }

    const isPasswordValid = await verifyPassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const decoded = verifyToken(refreshToken);

    if (decoded.type !== "refresh") {
      throw new AppError("Token de refresh inválido", 401);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError("Token de refresh expirado", 401);
    }

    if (!storedToken.user.isActive) {
      throw new AppError("Usuário inativo", 401);
    }

    const tokens = generateTokenPair({
      userId: storedToken.user.id,
      email: storedToken.user.email,
    });

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: tokens.accessToken };
  }

  async logout(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            ownedLists: true,
            sharedLists: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
