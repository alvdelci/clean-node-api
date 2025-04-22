/** @type {import('jest').Config} */
const config = {

  collectCoverage: true,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**'], // garante que todos os arquivos serao cobertos por testes exceto na pasta main

  preset: '@shelf/jest-mongodb',

  watchPathIgnorePatterns: ['globalConfig']

}

module.exports = config
