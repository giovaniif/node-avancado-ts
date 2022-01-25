export class ServerError extends Error {
  constructor (error?: Error) {
    super('server failed, try again please')
    this.name = 'ServerError'
    this.stack = error?.stack
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
