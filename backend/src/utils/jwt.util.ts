import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface JwtPayload {
  userId: string;
  email: string;
  type: "access" | "refresh";
  iat?: number;
  exp?: number;
}

function getJwtConfig(): {
  secret: string;
  accessExpiresIn: SignOptions["expiresIn"];
  refreshExpiresIn: SignOptions["expiresIn"];
} {
  const secret = process.env.JWT_SECRET;
  const access = process.env.JWT_EXPIRES_IN || "15m";
  const refresh = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }

  return {
    secret,
    accessExpiresIn: access as SignOptions["expiresIn"],
    refreshExpiresIn: refresh as SignOptions["expiresIn"],
  };
}

export function generateAccessToken(payload: {
  userId: string;
  email: string;
}): string {
  try {
    const { secret, accessExpiresIn } = getJwtConfig();

    const tokenPayload: Omit<JwtPayload, "iat" | "exp"> = {
      userId: payload.userId,
      email: payload.email,
      type: "access",
    };

    const options: SignOptions = {
      expiresIn: accessExpiresIn,
      issuer: "taskshare-api",
      audience: "taskshare-client",
    };

    return jwt.sign(tokenPayload, secret, options);
  } catch (error) {
    throw new Error("Erro ao gerar token de acesso");
  }
}

export function generateRefreshToken(payload: {
  userId: string;
  email: string;
}): string {
  try {
    const { secret, refreshExpiresIn } = getJwtConfig();

    const tokenPayload: Omit<JwtPayload, "iat" | "exp"> = {
      userId: payload.userId,
      email: payload.email,
      type: "refresh",
    };

    const options: SignOptions = {
      expiresIn: refreshExpiresIn,
      issuer: "taskshare-api",
      audience: "taskshare-client",
    };

    return jwt.sign(tokenPayload, secret, options);
  } catch (error) {
    throw new Error("Erro ao gerar refresh token");
  }
}

export function verifyToken(token: string): JwtPayload {
  try {
    const { secret } = getJwtConfig();

    const decoded = jwt.verify(token, secret, {
      issuer: "taskshare-api",
      audience: "taskshare-client",
    }) as JwtPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expirado");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Token inválido");
    }
    throw new Error("Erro ao verificar token");
  }
}

export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error("Erro ao decodificar token");
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

export function extractTokenFromHeader(
  authHeader: string | undefined,
): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return typeof parts[1] === "string" ? parts[1] : null;
}

export function generateTokenPair(payload: { userId: string; email: string }): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export function getTokenTimeRemaining(token: string): number {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = decoded.exp - currentTime;

    return Math.max(0, remaining);
  } catch (error) {
    return 0;
  }
}
