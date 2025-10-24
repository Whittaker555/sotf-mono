import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // By default, Jest looks for .test.ts, .test.js, .spec.ts, etc.
  // You can customize the pattern if you prefer:
  testMatch: ['**/tests/**/*.test.ts'],
  // Add any moduleNameMapper if you need to mock static assets, etc.
  // moduleNameMapper: {
  //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  // },
};

export default config;
