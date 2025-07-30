import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";

const api = request(app);

let accessToken = "";
let listId = "";

describe("Task Lists API", () => {
  const user = {
    name: "Lucas Lista",
    email: "lucas.list@test.com",
    password: "senha123",
  };

  before(async () => {
    // Limpa e registra usuário
    await prisma.user.deleteMany({ where: { email: user.email } });

    await api.post("/api/auth/register").send(user);
    const login = await api.post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });
    accessToken = login.body.data.tokens.accessToken;
  });

  after(async () => {
    await prisma.listShare.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.taskList.deleteMany({});
    await prisma.user.deleteMany({ where: { email: user.email } });
    await prisma.$disconnect();
  });

  it("cria uma nova lista", async () => {
    const res = await api
      .post("/api/lists")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Minha Lista Teste",
        description: "Testando criação de lista",
        color: "#FF0000",
      });

    expect(res.status).to.equal(201);
    expect(res.body.data.title).to.equal("Minha Lista Teste");
    listId = res.body.data.id;
  });

  it("lista todas as listas do usuário", async () => {
    const res = await api
      .get("/api/lists")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.greaterThan(0);
  });

  it("busca uma lista específica", async () => {
    const res = await api
      .get(`/api/lists/${listId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.id).to.equal(listId);
  });

  it("atualiza uma lista existente", async () => {
    const res = await api
      .put(`/api/lists/${listId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Título Atualizado",
        color: "#00FF00",
      });

    expect(res.status).to.equal(200);
    expect(res.body.data.title).to.equal("Título Atualizado");
  });

  it("deleta a lista", async () => {
    const res = await api
      .delete(`/api/lists/${listId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });
});
