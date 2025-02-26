import type { Config } from 'jest';
import { join, normalize } from 'path';

import jestConfig from '../../jest.config';

const moduleNameMapper = jestConfig.moduleNameMapper;
const reporters = jestConfig.reporters;

Object.keys(moduleNameMapper).forEach((key) => {
  moduleNameMapper[key] = (moduleNameMapper[key] as string).replace(
    '<rootDir>',
    normalize('<rootDir>/src'),
  );
});

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper,
  globalSetup: join(__dirname, `jest-e2e-global-setup.ts`),
  setupFiles: [join(__dirname, `jest-e2e-setup.ts`)],
  reporters,
};

export default config;
