import { AccessToken } from '@/domain/entities'

describe('access token', () => {
  it('should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
