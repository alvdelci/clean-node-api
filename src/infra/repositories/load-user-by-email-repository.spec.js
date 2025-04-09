const { MongoClient } = require('mongodb')
let client, db
class LoadUserByEmailRepository {
    constructor(userModel) {
        this.userModel = userModel
    }
    load(email) {
        const user = this.userModel.findOne({ email })
        return user
    }
}

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
        await userModel.insertOne({
            email: 'valid_email@mail.com'
        })
        const user = await sut.load('valid_email@mail.com')
        expect(user.email).toBe('valid_email@mail.com')
    });
});