module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/tests/**/*spec.[jt]s',
  ],
  setupFiles: [
    "./setupJest.ts"
  ],
  rootDir: __dirname,
  testURL: 'https://www.baidu.com/#/about?name=2'
}