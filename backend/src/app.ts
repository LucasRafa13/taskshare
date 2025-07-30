import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "@/config/env";
import { checkDatabaseHealth } from "@/config/database";
import authRoutes from "@/routes/auth.routes";
import listRoutes from "@/routes/list.routes";
import { handleError } from "@/middleware/error.middleware";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
  }),
);

app.use(morgan(config.app.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health Check melhorado
app.get("/api/health", async (_req, res) => {
  const isDatabaseHealthy = await checkDatabaseHealth();
  const uptime = process.uptime();

  res.status(isDatabaseHealthy ? 200 : 503).json({
    status: isDatabaseHealthy ? "OK" : "ERROR",
    message: "TaskShare API Health Check",
    timestamp: new Date().toISOString(),
    environment: config.app.nodeEnv,
    version: "1.0.0",
    uptime: {
      seconds: Math.floor(uptime),
      human: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    },
    database: {
      status: isDatabaseHealthy ? "connected" : "disconnected",
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: "MB",
    },
  });
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    message: "🎯 Bem-vindo à TaskShare API!",
    version: "1.0.0",
    environment: config.app.nodeEnv,
    endpoints: {
      health: "GET /api/health",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        logout: "POST /api/auth/logout",
        refresh: "POST /api/auth/refresh",
      },
      lists: {
        getAll: "GET /api/lists",
        create: "POST /api/lists",
        getById: "GET /api/lists/:id",
        update: "PUT /api/lists/:id",
        delete: "DELETE /api/lists/:id",
        share: "POST /api/lists/:id/share",
        unshare: "DELETE /api/lists/:id/share/:userId",
      },
      tasks: "Em breve...",
    },
    documentation: "Em breve...",
    status: "Funcional ✅",
  });
});

// Registrar rotas
app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);

// Middleware para rotas não encontradas
app.use((_req, _res, next) => {
  const error = new Error("Rota não encontrada");
  (error as any).status = 404;
  next(error);
});

// Error handler global usando o middleware estruturado
app.use(handleError);

export default app;
