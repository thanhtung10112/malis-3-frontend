module.exports = {
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: {
    '@/styles/(.*)': '<rootDir>/src/styles/$1',
    '@/store/(.*)': '<rootDir>/src/store/$1',
    '@/utils/(.*)': '<rootDir>/src/utils/$1',
    '@/types/(.*)': '<rootDir>/src/types/$1',
    '@/apis/(.*)': '<rootDir>/src/apis/$1',
    '@/components/(.*)': '<rootDir>/src/components/$1',
    '@/hooks/(.*)': '<rootDir>/src/hooks/$1',
    '@/helper/(.*)': '<rootDir>/src/helper/$1',
    '^@/components': '<rootDir>/src/components/index',
    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  }
}
