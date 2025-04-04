const { MissingParamError, InvalidParamError } = require('../../utils/errors')
class AuthUseCase {
    constructor(loadUserByEmailRepository) {
        this.loadUserByEmailRepository = loadUserByEmailRepository
    }
    async auth(email, password) {
        if (!email) {
            throw new MissingParamError('email')
        }
        if (!password) {
            throw new MissingParamError('password')
        }

        if (!this.loadUserByEmailRepository) {
            throw new MissingParamError('loadUserByEmailRepository')
        }

        if (!this.loadUserByEmailRepository.load) {
            throw new InvalidParamError('loadUserByEmailRepository')
        }

        const user = await this.loadUserByEmailRepository.load(email)

        if (!user) {
            return null
        }
    }
}

const makeSut = () => {
    class LoadUserByEmailRepositorySpy {
        async load(email) {
            this.email = email
        }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

    return {
        sut,
        loadUserByEmailRepositorySpy
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

    test('should return null if LoadUserByEmailRepository returns null', async () => {
        const { sut } = makeSut()
        const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')
        expect(accessToken).toBe(null)
    });
});