/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/__tests__/__*'],
  transform: { '^.+\\.ts$': '@swc/jest' }
};
