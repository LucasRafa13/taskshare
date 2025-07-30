import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("🐘 Banco de dados conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("🐘 Banco de dados desconectado!");
  } catch (error) {
    console.error("❌ Erro ao desconectar do banco de dados:", error);
  }
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("❌ Banco de dados não está saudável:", error);
    return false;
  }
}

process.on("beforeExit", async () => {
  await disconnectDatabase();
});

process.on("SIGINT", async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDatabase();
  process.exit(0);
});
