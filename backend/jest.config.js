module.exports = {
  preset: "ts-jest",

  testEnvironment: "node",

  roots: ["<rootDir>/src", "<rootDir>/tests"],

  testMatch: [
    "**/tests/**/*.test.ts",
    "**/tests/**/*.spec.ts",
    "**/__tests__/**/*.ts",
    "**/*.(test|spec).ts",
  ],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/config/(.*)$": "<rootDir>/src/config/$1",
    "^@/controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@/middleware/(.*)$": "<rootDir>/src/middleware/$1",
    "^@/routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/server.ts", // Arquivo de entrada
    "!src/config/**", // Configurações
    "!src/types/**", // Definições de tipos
  ],

  coverageDirectory: "coverage",

  coverageReporters: ["text", "text-summary", "html", "lcov", "clover"],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],

  transformIgnorePatterns: ["node_modules/(?!(module-that-needs-transform)/)"],

  testTimeout: 30000,

  globals: {
    "ts-jest": {
      tsconfig: {
        sourceMap: true,
        inlineSourceMap: false,
      },
    },
  },

  clearMocks: true,

  restoreMocks: true,

  verbose: true,

  detectOpenHandles: true,

  forceExit: true,

  testEnvironmentOptions: {},
};
