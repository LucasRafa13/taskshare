import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "@/config/env";
import { checkDatabaseHealth } from "@/config/database";
import authRoutes from "@/routes/auth.routes";
import listRoutes from "@/routes/list.routes";
import taskRoutes from "@/routes/task.routes";
import commentRoutes from "@/routes/comment.routes";
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

// Documentação detalhada
app.get("/api/docs", (_req, res) => {
  res.status(200).json({
    message: "📚 TaskShare API - Documentação",
    version: "1.0.0",
    baseUrl: `http://localhost:${config.app.port}/api`,
    authentication: "Bearer Token (JWT)",
    postmanCollection: "Importe o arquivo TaskShare.postman_collection.json",
    endpoints: {
      auth: {
        register: "POST /auth/register",
        login: "POST /auth/login",
        me: "GET /auth/me",
        logout: "POST /auth/logout",
        refresh: "POST /auth/refresh",
      },
      lists: {
        getAll: "GET /lists",
        create: "POST /lists",
        getById: "GET /lists/:id",
        update: "PUT /lists/:id",
        delete: "DELETE /lists/:id",
        share: "POST /lists/:id/share",
        unshare: "DELETE /lists/:id/share/:userId",
      },
      tasks: {
        getByList: "GET /list/:listId/tasks",
        create: "POST /list/:listId/tasks",
        getById: "GET /task/:id",
        update: "PUT /task/:id",
        toggle: "PATCH /task/:id/toggle",
        delete: "DELETE /task/:id",
        reorder: "PATCH /list/:listId/reorder",
      },
      comments: {
        getByTask: "GET /task/:taskId/comments",
        create: "POST /task/:taskId/comments",
        update: "PUT /comment/:id",
        delete: "DELETE /comment/:id",
      },
    },
    permissions: {
      READ: "Visualizar lista e tarefas",
      WRITE: "Criar/editar/excluir tarefas e comentários",
      OWNER: "Controle total da lista",
    },
    examples: {
      createUser: {
        url: "POST /auth/register",
        body: {
          name: "João Silva",
          email: "joao@email.com",
          password: "senha123456",
        },
      },
      createList: {
        url: "POST /lists",
        headers: { Authorization: "Bearer <token>" },
        body: {
          title: "Minha Lista",
          description: "Descrição opcional",
          color: "#4CAF50",
        },
      },
      createTask: {
        url: "POST /list/:listId/tasks",
        headers: { Authorization: "Bearer <token>" },
        body: {
          title: "Nova tarefa",
          description: "Descrição",
          priority: "HIGH",
          dueDate: "2025-12-31T23:59:59.000Z",
        },
      },
    },
  });
});

// Página principal da API
app.get("/api", (_req, res) => {
  res.status(200).json({
    message: "🎯 Bem-vindo à TaskShare API!",
    version: "1.0.0",
    environment: config.app.nodeEnv,
    endpoints: {
      health: "GET /api/health",
      docs: "GET /api/docs",
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
      tasks: {
        getByList: "GET /api/list/:listId/tasks",
        create: "POST /api/list/:listId/tasks",
        getById: "GET /api/task/:id",
        update: "PUT /api/task/:id",
        toggle: "PATCH /api/task/:id/toggle",
        delete: "DELETE /api/task/:id",
        reorder: "PATCH /api/list/:listId/reorder",
      },
      comments: {
        getByTask: "GET /api/task/:taskId/comments",
        create: "POST /api/task/:taskId/comments",
        update: "PUT /api/comment/:id",
        delete: "DELETE /api/comment/:id",
      },
    },
    documentation: "Documentação completa disponível em /api/docs",
    status: "Funcional ✅",
  });
});

// Registrar rotas
app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api", taskRoutes);
app.use("/api", commentRoutes);

// Middleware para rotas não encontradas
app.use((_req, _res, next) => {
  const error = new Error("Rota não encontrada");
  (error as any).status = 404;
  next(error);
});

// Error handler global usando o middleware estruturado
app.use(handleError);

export default app;
