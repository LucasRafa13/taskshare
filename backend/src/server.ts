import dotenv from "dotenv";

// Carregar variáveis de ambiente primeiro
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação: http://localhost:${PORT}/api`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(
    `🐘 Banco de dados: ${process.env.DATABASE_URL ? "✅ Conectado" : "❌ Não configurado"}`,
  );
});
