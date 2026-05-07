/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/controllers/**/*.js",
    "src/utils/**/*.js",
    "src/models/**/*.js",
    "!src/index.js"
  ],
  coverageThreshold: {
    global: {
      lines: 60
    }
  },
  testTimeout: 30000,
  verbose: true
}