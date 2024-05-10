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
  // moduleFileExtensions: [
  //   "js", "ts"
  // ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  }
};

export default config;
