/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';
import * as path from 'path';

const tsjest = path.resolve(__dirname, 'node_modules', 'ts-jest');

const config: Config = {
  rootDir: '..',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coveragePathIgnorePatterns: ["node_modules", "testsuite", "mjs/util/entities"],
  testEnvironment: "node",
  verbose: true,
  preset: tsjest,
  testMatch: [
    "**/tests/**/*.test.ts"
  ],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    "^.+\\.tsx?$": [ tsjest, { useESM: true } ],
  },
  reporters: ['default', [path.resolve(__dirname, 'src/texReporter.js'), {}]]
};

export default config;
