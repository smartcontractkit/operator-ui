module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src/',
    '<rootDir>/support/',
    '<rootDir>/__tests__',
  ],
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  globalSetup: './jest.globalSetup.js',
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/tmp/',
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/.eslintrc.js',
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^support/(.*)$': '<rootDir>/support/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  // d3 v7 ships ESM modules; allow SWC to transform them for Jest.
  transformIgnorePatterns: [
    '/node_modules/(?!(react-syntax-highlighter|d3|d3-[^/]+|internmap)/)',
  ],
  testEnvironment: 'jsdom',
  testTimeout: 20000,
  collectCoverage: true,
}
