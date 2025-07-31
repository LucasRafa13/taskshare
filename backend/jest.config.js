module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // Diretórios raiz para os testes
  roots: ["<rootDir>/src", "<rootDir>/tests"],

  // Padrões de arquivos de teste
  testMatch: [
    "**/tests/**/*.test.ts",
    "**/tests/**/*.spec.ts",
    "**/__tests__/**/*.ts",
    "**/*.(test|spec).ts",
  ],

  // Extensões de arquivo que o Jest deve processar
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Transformações
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Path mapping (IMPORTANTE - resolver @/ paths)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  // Coleta de cobertura
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/server.ts",
    "!src/config/**",
    "!src/types/**",
  ],

  // Diretório de saída da cobertura
  coverageDirectory: "coverage",

  // Formatos de relatório de cobertura
  coverageReporters: ["text", "text-summary", "html", "lcov"],

  // Ignorar arquivos específicos
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],

  // Timeout para testes
  testTimeout: 30000,
  

  // Configurações específicas do ts-jest
  globals: {
    "ts-jest": {
      tsconfig: {
        sourceMap: true,
        inlineSourceMap: false,
      },
    },
  },

  // Limpar mocks automaticamente entre testes
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
};
