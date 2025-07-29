import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "TaskShare API está funcionando!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  });
});

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

app.use((_req, _res, next) => {
  const error = new Error("Rota não encontrada");
  (error as any).status = 404;
  next(error);
});

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
