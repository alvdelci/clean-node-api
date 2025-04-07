const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
    class EncrypterSpy {
        async compare(password, hashedPassword) {
            this.password = password
            this.hashedPassword = hashedPassword
            return this.isValid
        }
    }

    const encrypterSpy = new EncrypterSpy()
    encrypterSpy.isValid = true

    return encrypterSpy
}

const makeTokenGenerator = () => {
    class TokenGeneratorSpy {
        async generate(userId) {
            this.userId = userId
            return this.accessToken
        }
    }

    const tokenGeneratorSpy = new TokenGeneratorSpy()
    tokenGeneratorSpy.accessToken = 'any_token'
    return tokenGeneratorSpy
}

const makeLoadUserByEmailRepository = () => {
    class LoadUserByEmailRepositorySpy {
        async load(email) {
            this.email = email
            return this.user
        }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy
    loadUserByEmailRepositorySpy.user = {
        id: 'any_id',
        password: 'hashed_password'
    }

    return loadUserByEmailRepositorySpy
}

const makeSut = () => {
    const encrypterSpy = makeEncrypter()
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const tokenGeneratorSpy = makeTokenGenerator()
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy)

    return {
        sut,
        loadUserByEmailRepositorySpy,
        encrypterSpy,
        tokenGeneratorSpy
    }
}

describe('Auth UseCase', () => {
    test('should return null if no email is provided', async () => {
        const { sut } = makeSut()
        const promisse = sut.auth()
        expect(promisse).rejects.toThrow(new MissingParamError('email'))
    });

    test('should return null if no password is provided', async () => {
        const { sut } = makeSut()
        const promisse = sut.auth('any_email@mail.com')
        expect(promisse).rejects.toThrow(new MissingParamError('password'))
    });

    test('should call LoadUserByEmailRepository with correct email', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut()
        await sut.auth('any_email@mail.com', 'any_password')
        expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
    });

    test('should throws if no LoadUserByEmailRepository is provided', async () => {
        const sut = new AuthUseCase()
        const promisse = sut.auth('any_email@mail.com', 'any_password')
        expect(promisse).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
    });

    test('should throws if no LoadUserByEmailRepository has no load method', async () => {
        const sut = new AuthUseCase({})
        const promisse = sut.auth('any_email@mail.com', 'any_password')
        expect(promisse).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
    });

    test('should return null if an invalid email is provided', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut()
        loadUserByEmailRepositorySpy.user = null
        const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')
        expect(accessToken).toBeNull()
    });

    test('should return null if an invalid password is provided', async () => {
        const { sut, encrypterSpy } = makeSut()
        encrypterSpy.isValid = false
        const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
        expect(accessToken).toBeNull()
    });

    test('should call Encrypter with correct values', async () => {
        const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
        await sut.auth('valid_email@mail.com', 'any_password')
        expect(encrypterSpy.password).toBe('any_password')
        expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
    });

    test('should call TokenGenerator with correct userId', async () => {
        const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
        await sut.auth('valid_email@mail.com', 'valid_password')
        expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    });
});