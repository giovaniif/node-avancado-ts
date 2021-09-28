import jwt from 'jsonwebtoken'

import { JwtTokenHandler } from '@/infra/crypto'

jest.mock('jsonwebtoken')

describe('jwt token handler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken', () => {
    let key: string
    let token: string
    let expirationInMs: number

    beforeAll(() => {
      key = 'any_key'
      expirationInMs = 1000
      token = 'any_token'
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call sign with correct params', async () => {
      await sut.generateToken({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })

    it('should return a token', async () => {
      const generatedToken = await sut.generateToken({ key, expirationInMs })

      expect(generatedToken).toBe(token)
    })

    it('should rethrow if sign throws', async () => {
      const error = new Error('token_error')
      fakeJwt.sign.mockImplementationOnce(() => { throw error })

      const promise = sut.generateToken({ key, expirationInMs })

      await expect(promise).rejects.toThrow(error)
    })
  })
})
