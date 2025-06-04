/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

// import type {Config} from 'jest';
import * as path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tsjest = path.resolve(__dirname, 'node_modules', 'ts-jest');

const config = {
  rootDir: '..',
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coveragePathIgnorePatterns: ["node_modules", "testsuite", "mjs/util/entities"],
  testEnvironment: "node",
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
