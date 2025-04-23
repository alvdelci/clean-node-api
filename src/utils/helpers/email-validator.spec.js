jest.mock('validator', () => ({
  isEmailValid: true,
  email: '',
  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}))

const validator = require('validator')
const EmailValidator = require('./email-validator')
const MissingParamError = require('../errors/missing-param-error')
// factory -> funcao que exporta um instancia de uma classe
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
    validator.isEmailValid = false // Alterando o valor padrao definido no mock
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email@mail.com')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    sut.isValid('any_email@mail.com')
    expect(validator.email).toBe('any_email@mail.com')
  })

  test('should throw if no email is provided', async () => {
    const sut = makeSut()
    expect(() => { sut.isValid() }).toThrow(new MissingParamError('email'))// Quando a funcao que vai ser testada nao e assincrona devemos passar o ponteiro dela, ja que nao retorna uma promise. Por isso a arrow fuction
  })
})
