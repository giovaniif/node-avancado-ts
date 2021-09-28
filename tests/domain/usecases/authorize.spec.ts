import { mock, MockProxy } from 'jest-mock-extended'

export namespace TokenValidator {
  export type Params = { token: string }
  export type Result = string
}

interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<TokenValidator.Result>
}

type Setup = (crypto: TokenValidator) => Authorize
type Input = { token: string }
type Output = string
type Authorize = (params: Input) => Promise<Output>

const setupAuthorize: Setup = crypto => async params => crypto.validateToken(params)

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_id')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('should call TokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  it('should return the correct access token', async () => {
    const userId = await sut({ token })

    expect(userId).toBe('any_id')
  })
})
