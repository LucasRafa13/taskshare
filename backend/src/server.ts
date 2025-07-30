import { config, validateConfig } from "./config/env";
import { connectDatabase } from "./config/database";
import app from "./app";

async function startServer(): Promise<void> {
  try {
    validateConfig();

    await connectDatabase();

    const server = app.listen(config.app.port, () => {
      console.log(`🚀 Servidor rodando na porta ${config.app.port}`);
      console.log(`📚 Documentação: http://localhost:${config.app.port}/api`);
      console.log(
        `🔍 Health Check: http://localhost:${config.app.port}/api/health`,
      );
      console.log(`🌍 Ambiente: ${config.app.nodeEnv}`);
    });

    const shutdown = (signal: string) => {
      console.log(`\n📴 Recebido sinal ${signal}, encerrando servidor...`);
      server.close(() => {
        console.log("✅ Servidor encerrado com sucesso!");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Erro ao inicializar servidor:", error);
    process.exit(1);
  }
}

startServer();
