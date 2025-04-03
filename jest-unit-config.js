const config = require('./jest.config')

/**Configuracoes para que os tests unitario aceitem apenas arquivos .spec.js, se a extensão for diferente os testes nao serao executados */
config.testMatch = ['**/*.spec.js']

module.exports = config