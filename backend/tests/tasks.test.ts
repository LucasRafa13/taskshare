// tests/tasks.test.ts
import { describe, it } from "mocha";
import request from "supertest";
import { expect } from "chai";
import app from "@/app";
import { prisma } from "@/config/prisma";
describe("Tasks API", () => {
  let token: string;
  let listId: string;
  let taskId: string;

  before(async () => {
    // Limpa tudo
    await prisma.refreshToken.deleteMany();
    await prisma.task.deleteMany();
    await prisma.taskList.deleteMany();
    await prisma.user.deleteMany();

    // Cria usuário
    const userRes = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test.tasks@test.com",
      password: "senha123",
    });
    token = userRes.body.data.tokens.accessToken;

    // Cria lista
    const listRes = await request(app)
      .post("/api/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Lista de Teste",
        description: "Descrição",
        color: "#FF0000",
      });
    listId = listRes.body.data.id;

    // Cria tarefa
    const taskRes = await request(app)
      .post(`/api/list/${listId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tarefa 1",
        description: "Descrição da tarefa",
        priority: "HIGH",
        dueDate: "2025-12-31T23:59:59.000Z",
      });
    taskId = taskRes.body.data.id;
  });

  it("deleta a tarefa", async () => {
    const res = await request(app)
      .delete(`/api/task/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Tarefa excluída com sucesso");
    expect(res.body.data).to.be.null;
  });

  
});
