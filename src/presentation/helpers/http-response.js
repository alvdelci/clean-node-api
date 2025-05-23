const UnauthorizedError = require('../errors/unauthorized-error')
const ServerError = require('../errors/server-error')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: { error: error.message }
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: {
        error: new ServerError().message
      }
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: {
        error: new UnauthorizedError().message
      }
    }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }
}
