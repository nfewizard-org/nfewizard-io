module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/\.rollup\.cache/'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: false,
      tsconfig: {
        module: 'CommonJS',
        moduleResolution: 'Node',
      },
    }],
  },
};