import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// ======================
// MIDDLEWARES GLOBAIS
// ======================

// Segurança
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

// Logs HTTP
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Parse JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ======================
// ROTAS
// ======================

// Health Check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "TaskShare API está funcionando!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  });
});

// Rota de boas-vindas
app.get("/api", (_req, res) => {
  res.status(200).json({
    message: "🎯 Bem-vindo à TaskShare API!",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      lists: "/api/lists",
      tasks: "/api/tasks",
    },
    documentation: "Em breve...",
  });
});

// ======================
// TRATAMENTO DE ERROS
// ======================

// Middleware para rotas não encontradas
app.use((_req, _res, next) => {
  const error = new Error("Rota não encontrada");
  (error as any).status = 404;
  next(error);
});

// Error handler global
app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("❌ Erro:", error);

    const statusCode = error.statusCode || error.status || 500;

    res.status(statusCode).json({
      error:
        error.status === 404
          ? "Endpoint não encontrado"
          : "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Algo deu errado",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  },
);

export default app;
