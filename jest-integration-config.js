const config = require('./jest.config')

/**Configuracoes para que os tests de integracao aceitem apenas arquivos .test.js, se a extensão for diferente os testes nao serao executados */
config.testMatch = ['**/*.test.js']

module.exports = config