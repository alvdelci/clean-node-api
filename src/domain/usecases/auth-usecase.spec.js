const { MissingParamError } = require('../../utils/errors')
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

        await this.loadUserByEmailRepository.load(email)
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
});