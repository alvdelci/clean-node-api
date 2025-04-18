const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return {
    userModel, sut
  }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_mail@mail.com')
    expect(user).toBeNull()
  })

  test('should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })

    const user = await sut.load('valid_email@mail.com')
    console.log(user)

    expect(user._id).toEqual(fakeUser.insertedId)
  })

  test('should throw if no userMode is provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('any_mail@mail.com')
    expect(promise).rejects.toThrow()
  })
})
