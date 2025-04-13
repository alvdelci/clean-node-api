const { MongoClient } = require('mongodb')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
let client, db

const makeSut = () => {
    const userModel = db.collection('users')
    const sut = new LoadUserByEmailRepository(userModel)

    return {
        userModel, sut
    }
}

describe('LoadUserByEmail Repository', () => {

    beforeAll(async () => {
        client = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db();
    });

    beforeEach(async () => {
        db.collection('users').deleteMany()
    })

    afterAll(async () => {
        await client.close()
    })

    test('should return null if no user is found', async () => {
        const { sut } = makeSut()
        const user = await sut.load('invalid_mail@mail.com')
        expect(user).toBeNull()
    });

    test('should return an user if user is found', async () => {
        const { sut, userModel } = makeSut()
        const fakeUser = await userModel.insertOne({
            email: 'valid_email@mail.com',
            password: 'hashed_password'
        })

        const user = await sut.load('valid_email@mail.com')
        console.log(user);

        expect(user._id).toEqual(fakeUser.insertedId)
    });
});