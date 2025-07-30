import { expect } from "chai";
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  generateSecurePassword,
} from "@/utils/password.util";

describe("Password Utils", () => {
  const password = "Senha123!";
  let hash: string;

  it("deve gerar um hash de senha", async () => {
    hash = await hashPassword(password);
    expect(hash).to.be.a("string");
    expect(hash.length).to.be.greaterThan(0);
  });

  it("deve verificar senha corretamente", async () => {
    const isValid = await verifyPassword(password, hash);
    expect(isValid).to.be.true;
  });

  it("deve validar força da senha", () => {
    const result = validatePasswordStrength(password);
    expect(result.isValid).to.be.true;
    expect(result.score).to.be.greaterThan(2);
  });

  it("deve gerar senha segura aleatória", () => {
    const generated = generateSecurePassword(16);
    expect(generated).to.be.a("string");
    expect(generated.length).to.equal(16);
  });
});
