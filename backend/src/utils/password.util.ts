import bcrypt from "bcryptjs";
import { config } from "@/config/env";

/**
 * @param password
 * @returns
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(config.security.bcryptSaltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error("Erro ao gerar hash da senha");
  }
}

/**
 * @param password
 * @param hash
 * @returns
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error("Erro ao verificar senha");
  }
}

/**
 * @param password
 * @returns
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial");
  } else {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.min(score, 5),
  };
}

/**
 * @param length
 * @returns
 */
export function generateSecurePassword(length: number = 16): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allChars = lowercase + uppercase + numbers + symbols;

  let password = "";
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
