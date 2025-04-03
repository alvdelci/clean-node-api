const validator = require('validator')
class EmailValidator {
    isValid(email) {
        return validator.isEmail(email)
    }
}

//factory -> funcao que exporta um instancia de uma classe
const makeSut = () => {
    return new EmailValidator()
}

describe('Email Validator', () => {
    test('Should return true if validator returns true', () => {
        const sut = makeSut()
        const isEmailValid = sut.isValid('valid_email@mail.com')
        expect(isEmailValid).toBe(true)
    })

    test('Should return false if validator returns false', () => {
        validator.isEmailValid = false //Alterando o valor padrao definido no mock
        const sut = makeSut()
        const isEmailValid = sut.isValid('invalid_email@mail.com')
        expect(isEmailValid).toBe(false)
    })
})