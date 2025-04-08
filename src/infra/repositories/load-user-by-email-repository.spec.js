class LoadUserByEmailRepository {
    load(email) {
        return null
    }
}

describe('LoadUserByEmail Repository', () => {
    test('should return null id no user is found', async () => {
        const sut = new LoadUserByEmailRepository()
        const user = await sut.load('invalid_mail@mail.com')
        expect(user).toBeNull()
    });
});