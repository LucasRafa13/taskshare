// tests/comments.test.ts
import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../src/app";
import { prisma } from "@/config/prisma";

let token: string;
let taskId: string;
let commentId: string;

describe("Comments API", () => {
  before(async () => {
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.taskList.deleteMany();
    await prisma.user.deleteMany();

    // Criação do usuário
    const user = {
      name: "Comentador",
      email: "comentador@example.com",
      password: "senha123",
    };

    await request(app).post("/api/auth/register").send(user);
    const login = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    token = login.body.data.tokens.accessToken;

    // Criação de uma lista
    const listRes = await request(app)
      .post("/api/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Lista Comentável" });

    const listId = listRes.body.data.id;

    // Criação de uma tarefa
    const taskRes = await request(app)
      .post(`/api/list/${listId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tarefa com comentários",
        description: "Tarefa que será comentada",
      });

    taskId = taskRes.body.data.id;
  });

  it("cria um comentário na tarefa", async () => {
    const res = await request(app)
      .post(`/api/task/${taskId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Esse é um comentário de teste.",
      });

    expect(res.status).to.equal(201);
    expect(res.body.data).to.have.property("id");
    commentId = res.body.data.id;
  });

  it("lista comentários da tarefa", async () => {
    const res = await request(app)
      .get(`/api/task/${taskId}/comments`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an("array");
    expect(res.body.data[0]).to.have.property("content");
  });

  it("atualiza um comentário", async () => {
    const res = await request(app)
      .put(`/api/comment/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Comentário editado com sucesso.",
      });

    expect(res.status).to.equal(200);
    expect(res.body.data.content).to.equal("Comentário editado com sucesso.");
  });

  it("deleta um comentário", async () => {
    const res = await request(app)
      .delete(`/api/comment/${commentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.include("excluído");
  });

  after(async () => {
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.taskList.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});
