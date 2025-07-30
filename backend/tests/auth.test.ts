import { describe, it, before } from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/app";
import { prisma } from "@/config/prisma";

const { expect } = chai;

describe("Auth API", () => {
  const user = {
    name: "João Mocha",
    email: "joao.mocha@test.com",
    password: "senha123",
  };

  before(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });

  it("deve registrar usuário", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).to.equal(201);
    expect(res.body.data.user.email).to.equal(user.email);
  });

  it("deve logar com sucesso", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.status).to.equal(200);
    expect(res.body.data.tokens).to.have.property("accessToken");
  });
});
