const { MissingParamError } = require('../../utils/errors')
class AuthUseCase {
    async auth(email) {
        if (!email) {
            throw new MissingParamError('email')
        }
    }
}

describe('Auth UseCase', () => {
    test('should return null if no email is provided', async () => {
        const sut = new AuthUseCase()
        const promisse = sut.auth()
        expect(promisse).rejects.toThrow(new MissingParamError('email'))
    });
});