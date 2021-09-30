export class ServerError extends Error {
  constructor (error?: Error) {
    super('server failed, try again please')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The field ${fieldName} is required`)
    this.name = 'RequiredFieldError'
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor () {
    super('access denied')
    this.name = 'ForbiddenError'
  }
}
