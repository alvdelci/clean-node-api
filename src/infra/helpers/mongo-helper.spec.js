const sut = require('./mongo-helper')

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await sut.disconnect()
  })
  test('should reconnect when getCollection() is invoked and client is disconnected', async () => {
    expect(sut.db).toBeTruthy()
    await sut.disconnect()
    expect(sut.db).toBeFalsy()
    await sut.getCollection('')
    expect(sut.db).toBeTruthy()
  })
})
