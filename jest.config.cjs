module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // ✅ penting: bukan setupFiles
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // supaya bisa handle JSX
  },
};