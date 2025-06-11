module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/tests/**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/'
    ],
    coverageReporters: ['text', 'lcov'],
    verbose: true
}; 