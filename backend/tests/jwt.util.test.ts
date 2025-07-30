import { expect } from "chai";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
  extractTokenFromHeader,
  generateTokenPair,
  getTokenTimeRemaining,
} from "@/utils/jwt.util";

describe("JWT Utils", () => {
  const payload = { userId: "user-123", email: "test@example.com" };

  let accessToken: string;
  let refreshToken: string;

  it("deve gerar um token de acesso válido", () => {
    accessToken = generateAccessToken(payload);
    expect(accessToken).to.be.a("string");
  });

  it("deve gerar um refresh token válido", () => {
    refreshToken = generateRefreshToken(payload);
    expect(refreshToken).to.be.a("string");
  });

  it("deve verificar e decodificar um token", () => {
    const decoded = verifyToken(accessToken);
    expect(decoded.userId).to.equal(payload.userId);
    expect(decoded.email).to.equal(payload.email);
    expect(decoded.type).to.equal("access");
  });

  it("deve decodificar o token sem verificar", () => {
    const decoded = decodeToken(accessToken);
    expect(decoded).to.have.property("userId", payload.userId);
  });

  it("não deve estar expirado imediatamente", () => {
    const expired = isTokenExpired(accessToken);
    expect(expired).to.be.false;
  });

  it("deve extrair token do header corretamente", () => {
    const header = `Bearer ${accessToken}`;
    const token = extractTokenFromHeader(header);
    expect(token).to.equal(accessToken);
  });

  it("deve retornar par de tokens válidos", () => {
    const { accessToken, refreshToken } = generateTokenPair(payload);
    expect(accessToken).to.be.a("string");
    expect(refreshToken).to.be.a("string");
  });

  it("deve retornar tempo restante positivo", () => {
    const time = getTokenTimeRemaining(accessToken);
    expect(time).to.be.greaterThan(0);
  });
});
