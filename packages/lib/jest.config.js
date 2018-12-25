module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>/lib/',
    '<rootDir>/node_modules/',
  ],
  testRegex: "\\.test\\.ts$",
  transform: {
    "^.+\\.(ts)$": "<rootDir>/node_modules/babel-jest",
  },
  moduleFileExtensions: [
    "ts",
    "js",
    "jsx",
    "json",
    "node"
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
};
