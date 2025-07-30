import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não encontrada: ${key}`);
  }
  return value;
}

export const config = {
  app: {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000", 10),
    apiVersion: process.env.API_VERSION || "v1",
  },

  database: {
    url: requireEnv("DATABASE_URL"),
  },

  // JWT
  jwt: {
    secret: requireEnv("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },

  // CORS
  cors: {
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
  },

  logs: {
    level: process.env.LOG_LEVEL || "info",
    prettyLogs: process.env.PRETTY_LOGS === "true",
    logFile: process.env.LOG_FILE,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutos
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
    sessionSecret: process.env.SESSION_SECRET,
  },

  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || "noreply@taskshare.com",
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // 5MB
    uploadPath: process.env.UPLOAD_PATH || "uploads/",
  },
};

// Validar configurações críticas
export function validateConfig(): void {
  try {
    if (config.jwt.secret.length < 32) {
      console.warn(
        "⚠️  JWT_SECRET deve ter pelo menos 32 caracteres para segurança",
      );
    }

    if (!["development", "test", "production"].includes(config.app.nodeEnv)) {
      console.warn(`⚠️  NODE_ENV inválido: ${config.app.nodeEnv}`);
    }

    if (config.app.port < 1 || config.app.port > 65535) {
      throw new Error(`Porta inválida: ${config.app.port}`);
    }

    console.log("✅ Configurações validadas com sucesso!");

    if (config.app.nodeEnv === "development") {
      console.log("📋 Configurações carregadas:");
      console.log(`   - Ambiente: ${config.app.nodeEnv}`);
      console.log(`   - Porta: ${config.app.port}`);
      console.log(
        `   - Banco: ${config.database.url.replace(/\/\/.*@/, "//***:***@")}`,
      );
      console.log(`   - CORS: ${config.cors.allowedOrigins.join(", ")}`);
    }
  } catch (error) {
    console.error("❌ Erro na validação das configurações:", error);
    process.exit(1);
  }
}

export const isDevelopment = config.app.nodeEnv === "development";
export const isProduction = config.app.nodeEnv === "production";
export const isTest = config.app.nodeEnv === "test";
