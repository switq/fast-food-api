module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
    "^@entities/(.*)$": "<rootDir>/src/domain/entities/$1",
    "^@gateways/(.*)$": "<rootDir>/src/infrastructure/gateways/$1",
    "^@app-gateways/(.*)$": "<rootDir>/src/application/interfaces/gateways/$1",    "^@repositories/(.*)$": "<rootDir>/src/domain/repositories/$1",
    "^@infra-interfaces/(.*)$": "<rootDir>/src/infrastructure/interfaces/$1",
    "^@presenters/(.*)$": "<rootDir>/src/presentation/presenters/$1",
    "^@controllers/(.*)$": "<rootDir>/src/presentation/controllers/$1",
    "^@presentation-gateways/(.*)$": "<rootDir>/src/presentation/gateways/$1",
    "^@usecases/(.*)$": "<rootDir>/src/application/use-cases/$1",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  verbose: true,
};
