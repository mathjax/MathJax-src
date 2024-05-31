/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  verbose: true,
  preset: 'ts-jest',
  testMatch: [
    "**/tests/**/*.test.ts"
  ],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  }
};

export default config;
