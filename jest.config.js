const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
    coveragePathIgnorePatterns: ['<rootDir>/test/'],
    rootDir: './',
    roots: ['<rootDir>'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/'}),
    },
    moduleFileExtensions: ["js", "json", "ts"],
    testRegex: "test/.*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "./coverage",
};
